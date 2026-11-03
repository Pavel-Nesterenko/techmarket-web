<?php
/**
 * Plugin Name: TechMarket Custom
 * Description: Дополнительные функции интернет-магазина TechMarket.
 * Version: 1.0.0
 * Author: TechMarket
 * Requires Plugins: woocommerce
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Вывод информационного блока на странице товара.
 */
function techmarket_show_product_info() {
    if (!function_exists('is_product') || !is_product()) {
        return;
    }

    ?>
    <div class="techmarket-product-info">
        <h3>Преимущества TechMarket</h3>
        <ul>
            <li>Проверка товара перед отправкой</li>
            <li>Поддержка покупателей</li>
            <li>Удобное оформление заказа</li>
        </ul>
    </div>
    <?php
}

add_action(
    'woocommerce_single_product_summary',
    'techmarket_show_product_info',
    35
);

/**
 * Подключение оформления информационного блока.
 */
function techmarket_add_custom_styles() {
    if (!function_exists('is_product') || !is_product()) {
        return;
    }

    $css = '
        .techmarket-product-info {
            margin: 24px 0;
            padding: 20px;
            background-color: #f4f7fb;
            border-left: 4px solid #2563eb;
            border-radius: 8px;
        }

        .techmarket-product-info h3 {
            margin: 0 0 12px;
            font-size: 20px;
            font-weight: 600;
        }

        .techmarket-product-info ul {
            margin: 0;
            padding-left: 20px;
        }

        .techmarket-product-info li {
            margin-bottom: 8px;
        }
    ';

    wp_register_style(
        'techmarket-custom-style',
        false,
        array(),
        '1.0.0'
    );

    wp_enqueue_style('techmarket-custom-style');
    wp_add_inline_style('techmarket-custom-style', $css);
}

add_action('wp_enqueue_scripts', 'techmarket_add_custom_styles');
