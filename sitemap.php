<?php
// Устанавливаем заголовок XML
header('Content-Type: application/xml; charset=utf-8');

// Автоматическая дата последнего изменения
$lastmod = date('Y-m-d');

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    <!-- Главная страница -->
    <url>
        <loc>https://uzbro.ru/</loc>
        <lastmod><?php echo $lastmod; ?></lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
        <xhtml:link rel="alternate" hreflang="ru" href="https://uzbro.ru/"/>
    </url>

    <!-- Услуги -->
    <url>
        <loc>https://uzbro.ru/#services</loc>
        <lastmod><?php echo $lastmod; ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>

    <!-- О нас -->
    <url>
        <loc>https://uzbro.ru/#parallax-combined</loc>
        <lastmod><?php echo $lastmod; ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Контакты -->
    <url>
        <loc>https://uzbro.ru/#info</loc>
        <lastmod><?php echo $lastmod; ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Отзывы -->
    <url>
        <loc>https://uzbro.ru/#reviews</loc>
        <lastmod><?php echo $lastmod; ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>

    <!-- Запись онлайн -->
    <url>
        <loc>https://n2133024.yclients.com/</loc>
        <lastmod><?php echo $lastmod; ?></lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>

</urlset>