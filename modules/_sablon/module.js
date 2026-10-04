// DİQQƏT: Yeni menyu üçün bu qovluğu kopyalayın, adını dəyişin (məs: modules/yeni_menyu), "_" işarəsini silin,
// iki fayldakı "yeni_menyu" və "YENİ MENYU ADI" yazılarını dəyişin. Sonra: sudo systemctl restart blueteam-hub
// ===== MENYU: YENİ MENYU ADI (backend) =====
// Nə edir: bu menyunun serverdəki hissəsi. URL, istifadəçi və parolu şifrəli saxlayır.
// Menyunun adını dəyişmək üçün aşağıdakı title sətrini redaktə edin.
// Əlavə funksiya (API sorğuları və s.) lazım olsa, bu faylda əlavə edilə bilər.
module.exports=require('../../core/tool-module')({id:'yeni_menyu',title:'YENİ MENYU ADI',order:13});
