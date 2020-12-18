import React, { useEffect, useState } from 'react';
import './styles.css';

function App() {

  interface Product {
    title: string;
    price: string;
    image: string;
    url: string;
    from: string;
  }

  const [products, setProducts] = useState([] as Product[]);

  useEffect(()=> {
    async function getProducts(){
      const data = await fetch('http://localhost:3333/files/products.json');

      const products = await data.json();

      setProducts(products);
      console.log(products);
    }
    getProducts();
  }, []);

  return (
    <>
      <div className="App">
        <h1>Resultado da busca pelo produto:</h1>
        <ul>
          {products && products.map(product => (
            <li key={product.title}>
              <a href={product.url} target="_blank" rel="noopener noreferrer">
                <img src={product.image} alt={product.title}/>
                <h3>{product.title}</h3>
                <p>{product.price}</p>
                <small>por: {product.from}</small>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
