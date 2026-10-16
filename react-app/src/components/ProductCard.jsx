
function ProductCard({ product, onAddToCart }) {

    return (
        <div className="col-12 col-lg-6">

            <article className="product-card card shadow-sm h-100">

                <a href={`#product/${product.id}`}>
                    <img
                        src={product.image}
                        className="card-img-top"
                        alt={product.name}
                    />
                </a>

                <div className="card-body">

                    <h3 className="card-title">
                        <a href={`#product/${product.id}`}>
                            {product.name}
                        </a>
                    </h3>

                    <p className="card-text">
                        {product.description}
                    </p>

                    <p className="price">
                        <strong>
                            {product.price.toLocaleString('ru-RU')} ₽
                        </strong>
                    </p>

                    <div className="d-flex flex-wrap gap-2">

                        <a
                            className="btn btn-dark"
                            href={`#product/${product.id}`}
                        >
                            Подробнее
                        </a>

                        <button
                            className="btn btn-outline-dark"
                            type="button"
                            onClick={() => onAddToCart(product)}
                        >
                            В корзину
                        </button>

                    </div>

                </div>

            </article>

        </div>
    );
}

export default ProductCard;
