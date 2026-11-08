# Sahadan görünüm galerisi

Galeri `index.html` içindeki `#galeri` bölümünde yer alır. Ek bağımlılık veya derleme gerektirmez; GitHub Pages ile çalışır.

## Fotoğraf eklemek

1. Fotoğrafı `assets/images/` klasörüne ekleyin. Küçük harfli, boşluksuz bir dosya adı tercih edin.
2. `data-gallery-track` içindeki bir `<figure class="gallery-slide" data-gallery-slide>` bloğunu kopyalayın.
3. Bağlantının `href` ve görselin `src` değerlerini yeni dosyaya yönlendirin. `alt`, `aria-label`, kategori ve başlığı güncelleyin.

Küçük önizlemeler ve gezinme yeni fotoğrafı otomatik olarak kullanır. Görselin yatay veya dikey olması için ayrıca ayar gerekmez. Ana görüntü ve büyük görünüm `object-fit: contain` kullanarak fotoğrafın tamamını gösterir; küçük önizlemeler sabit boyutları için kırpılır.

## Davranış

- Fotoğraflar bölüm görünürken 5 saniyede bir ilerler, son fotoğraftan başa döner.
- Oklar, küçük önizlemeler, klavye yön tuşları ve mobilde yatay kaydırma kullanılabilir.
- Masaüstünde önizlemeler ana fotoğrafın solundaki dikey listede yer alır. Bu listede yukarı/aşağı tuşlarıyla da fotoğraf seçilebilir. Mobilde önizlemeler fotoğrafın altındaki yatay şeride geçer.
- Fare bölümün üzerindeyken, klavye odağı galerideyken, büyük görünüm açıkken veya sekme arka plandayken otomatik geçişler bekler. Etkileşim bittikten sonra süre yeniden başlar.
- Otomatik geçiş düğmesiyle akış durdurulabilir. İşletim sisteminde hareketi azalt seçiliyse başlangıçta kapalıdır.
- Fotoğrafa tıklamak büyük görünümü açar. Kapat düğmesi veya Escape ile çıkılır.

Görünüm `gallery.css`, davranış `gallery.js` dosyasında düzenlenir. Süreyi değiştirmek için `gallery.js` içindeki `5000` değerini milisaniye olarak güncelleyin.
