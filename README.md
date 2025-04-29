Üretim Hattı Optimizasyonu
Bu proje, dinamik programlama yaklaşımı kullanarak bir üretim hattındaki işlerin optimum şekilde planlanmasını sağlayan bir algoritma implementasyonudur.
Problem Tanımı
Bir üretim hattında n adet iş sırayla tamamlanmalıdır. Bu işler, m farklı makinede yapılabilir. Her işin her makinedeki tamamlanma süresi farklıdır ve makineler arasında geçiş yapılması durumunda bir geçiş maliyeti (örneğin, makine ayar süresi veya taşıma maliyeti) ortaya çıkar.
Amaç: Tüm işleri sırayla tamamlamak için minimum toplam süreyi bulmak.
Matris Zinciri Çarpımı ile İlişkisi
Bu problem, matris zinciri çarpımı (Matrix Chain Multiplication) problemi ile yapısal olarak benzerlik göstermektedir:
•	Matris Zinciri Çarpımı: Bir dizi matrisi hangi sırayla çarparsak minimum işlem yaparız?
•	Üretim Hattı Problemi: İşleri hangi makinelerde yaparsak minimum toplam süreyi elde ederiz?
Her iki problemde de:
1.	Alt problemlerin optimal çözümleri ile genel probleme optimal çözüm elde edilir
2.	Seçimler zincirleme olarak bir sonraki alt problemleri etkiler
3.	Bir "bölüm noktası" veya "geçiş" kararı optimal çözümü belirler
Algoritma İmplementasyonu
Bu projede iki farklı dinamik programlama yaklaşımı kullanılmıştır:
1. Tablolama (Bottom-Up) Yaklaşımı
İteratif olarak alt problemlerden başlayıp, çözümleri bir tabloda saklayarak daha büyük problemlere doğru çıkar.
2. Hafızalama (Top-Down) Yaklaşımı
Recursif olarak problemi alt problemlere bölerek çözer ve sonuçları bir hafıza (memo) tablosunda saklar.
Adım Adım Algoritma Açıklaması
Aşağıda, tablolama yaklaşımının adım adım işleyişi açıklanmıştır:
1.	Başlangıç: dp[i][j] tablosu oluşturulur. Burada dp[i][j], i. işin j. makinede yapılması durumunda minimum toplam süreyi temsil eder.
2.	Taban Durumu: İlk iş (i=0) için her makine j'de:
3.	dp[0][j] = processingTime[0][j]
4.	İterasyon: İkinci işten (i=1) başlayarak her iş için:
o	Her makine j için: 
	Önceki iş (i-1) için tüm olası makineleri k dene: 
	dp[i][j] = min(dp[i][j], dp[i-1][k] + transitionCost[k][j] + processingTime[i][j])
5.	Sonuç: Son iş n-1 için minimum değer:
6.	minTotalTime = min(dp[n-1][j]) for j=0 to m-1
Test Sonuçları
Algoritma, iki farklı test durumu ile doğrulanmıştır:
Test Durumu 1:
•	3 iş, 2 makine
•	Beklenen minimum süre: 18
•	Hesaplanan minimum süre: 18
•	Optimal iş-makine ataması: 
o	İş 1: Makine 1
o	İş 2: Makine 2
o	İş 3: Makine 1
Test Durumu 2:
•	4 iş, 3 makine
•	Hesaplanan minimum süre: 20
•	Optimal iş-makine ataması: 
o	İş 1: Makine 1
o	İş 2: Makine 3
o	İş 3: Makine 3
o	İş 4: Makine 1
Karmaşıklık Analizi
Zaman Karmaşıklığı
•	Tablolama (Bottom-Up): O(n * m²)
o	n = iş sayısı, m = makine sayısı
o	İç içe üç döngü: işler (n), hedef makineler (m), önceki makineler (m)
•	Hafızalama (Top-Down): En kötü durumda O(n * m²)
o	Her alt problem en fazla bir kez hesaplanır
o	Her hesaplama işleminde m makine kontrol edilir
Uzay Karmaşıklığı
•	Her iki yaklaşım için de O(n * m) 
o	DP/memo tablosu n*m boyutundadır
o	Yol bulma için ek O(n) alan gerekir
Demo Videosu
Algoritmanın çalışmasını ve test sonuçlarını gösteren demo videosu bu repoda bulunmaktadır.
Sonuç
Bu proje, dinamik programlama tekniklerinin üretim planlama gibi gerçek dünya problemlerine nasıl uygulanabileceğini göstermektedir. Hem tablolama hem de hafızalama yaklaşımları, minimum toplam süreyi bulmak için etkili çözümler sunmaktadır.

