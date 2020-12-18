import puppeteer, {Page} from 'puppeteer';
import readlineSync from 'readline-sync';
import fs from 'fs';
import path from 'path';

interface Product {
  title: string;
  image: string | undefined | null;
  url: string | undefined | null;
  price: string;
  from: string;
}

interface ListSelectors {
  listContainer: string;
  productContainer: string;
  title: string;
  price: string;
  image: string;
  isImageLazy: boolean;
}

interface ProductProvider {
  url: string;
  name: string;
  listSelectors: ListSelectors;
  searchTermSeparator: string;
}
interface getProducts {
  page: Page;
  provider:ProductProvider;
  searchText: string;
}

const productProviders: ProductProvider[] = [
  {
    url: 'https://lista.mercadolivre.com.br/',
    name: 'Mercado Livre',
    listSelectors: {
      listContainer : '.ui-search-results',
      productContainer: 'ol li',
      title: 'h2',
      price: '.price-tag.ui-search-price__part:not(.price-tag__disabled)',
      image: 'img',
      isImageLazy : true
    },
    searchTermSeparator: '-',
  },
  {
    url: 'https://sp.olx.com.br/?q=',
    name: 'OLX',
    listSelectors: {
      listContainer : '#ad-list',
      productContainer: 'li',
      title: 'h2',
      price: 'p',
      image: 'img',
      isImageLazy : true
    },
    searchTermSeparator: 'encode',
  },
  {
    url: 'https://www.enjoei.com.br/s?sr=near_regions&q=',
    name: 'Enjoei',
    listSelectors: {
      listContainer : '.c-product-feed__list',
      productContainer: '.c-product-card',
      title: 'h3',
      price: '.c-product-card__price span',
      image: 'img',
      isImageLazy : true
    },
    searchTermSeparator: '+',
  }
];

async function startWebScrapper(){
  const term = readlineSync.question('O que você procura?\n');

  const browser = await puppeteer.launch({ headless: true });
  let [page] = await browser.pages();

  const productList:Product[] = [];

  const searchText = productProviders[0].searchTermSeparator === 'encode' ?
  encodeURI(term) : term.replace(' ', productProviders[0].searchTermSeparator);

  await Promise.all(productProviders.map(async (provider, index) => {
    if(index !== 0)
      page = await browser.newPage();

    const products = await getProductsFromPage({page, provider, searchText});
    productList.push(...products);

    return;
  }));

  // console.log(productList);

  await fs.promises.writeFile(
    path.resolve(__dirname, '..', 'tmp', 'products.json'), JSON.stringify(productList)
  );

  await browser.close();

  return;
}

async function getProductsFromPage({page, provider, searchText}:getProducts){
  const browserData = JSON.stringify({productProvider: provider});

  await page.goto(`${provider.url}${searchText}`);
  // await page.screenshot({ path: 'screenshot.png' });

  const productList = await page.evaluate((browserData)=>{

    const { productProvider }: {productProvider: ProductProvider} = JSON.parse(browserData);

    const selectors = productProvider.listSelectors;

    const results = document.querySelector(selectors.listContainer) as Element;
    const array: Element[] = [...results.querySelectorAll(selectors.productContainer)];
    const productList: Product[] = [];

    array.map((element) => {

      const product = {
        title: element.querySelector(selectors.title)?.textContent as string,
        image: element.querySelector(selectors.image)?.getAttribute('data-src') ?? 
        element.querySelector(selectors.image)?.getAttribute('src'),
        url: element.querySelector('a')?.getAttribute('href'),
        price: Intl.NumberFormat(
          'pt-BR', 
          {style:'currency', currency: 'BRL'})
          .format(
            Number(element.querySelector(selectors.price)?.textContent
            ?.replace(/\D/g, ''))
          ),
        from: productProvider.name
      };

      if (product.title)
        productList.push(product);

      return product;
    });

    return(productList);
  }, browserData);

  return productList;
}

startWebScrapper();