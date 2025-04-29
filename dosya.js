/**  
 * Üretim Hattı Optimizasyonu - Dinamik Programlama Uygulaması
 * 
 * Bu algoritma, bir üretim hattında n adet işin m farklı makinede yapılması durumunda, 
 * işleri sırayla tamamlamak için gereken minimum toplam süreyi hesaplar.
 * 
 * Her işin her makinedeki işlenme süresi farklıdır ve makineler arası geçişlerde
 * ek bir maliyet (geçiş maliyeti) oluşur.
 * 
 * Problem, matris zinciri çarpımı problemine benzer yapıdadır:
 * - Matris zinciri çarpımında: Matrisler hangi sırayla çarpılmalı? 
 * - Bu problemde: İşler hangi makinelerde yapılmalı?
 * Her iki problem de optimal alt yapılara sahiptir ve dinamik programlama ile çözülebilir.
 */

/**
 * Tablolama (Bottom-Up) Yaklaşımı
 * 
 * dp[i][j] = i. işin j. makinede yapılması durumunda minimum toplam süredir.
 * 
 * @param {number} n - İş sayısı
 * @param {number} m - Makine sayısı
 * @param {number[][]} processingTime - İşlerin her makinede işlenme süreleri
 * @param {number[][]} transitionCost - Makineler arası geçiş maliyetleri
 * @returns {number} Minimum toplam süre
 */
function minTotalTime(n, m, processingTime, transitionCost) {
    // Giriş doğrulama
    if (!n || !m || !processingTime || !transitionCost) {
        throw new Error("Geçersiz giriş parametreleri");
    }
    
    // DP tablosu: dp[i][j] = i. işin j. makinede yapılması durumundaki minimum toplam süre
    const dp = Array.from({ length: n }, () => Array(m).fill(Infinity));
    

    for (let j = 0; j < m; j++) {
        dp[0][j] = processingTime[0][j];
    }
    
 
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < m; j++) {
            for (let k = 0; k < m; k++) {
               
                const cost = dp[i - 1][k] + transitionCost[k][j] + processingTime[i][j];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    
    
    const optimalPath = findOptimalPath(n, m, dp, processingTime, transitionCost);
    
    return {
        minTime: Math.min(...dp[n - 1]),
        optimalPath: optimalPath
    };
}

/** 
 * 
 * @param {number} n - İş sayısı
 * @param {number} m - Makine sayısı
 * @param {number[][]} dp - Dinamik programlama tablosu
 * @param {number[][]} processingTime - İşlerin her makinede işlenme süreleri
 * @param {number[][]} transitionCost - Makineler arası geçiş maliyetleri
 * @returns {number[]} Her işin hangi makinede yapıldığı
 */
function findOptimalPath(n, m, dp, processingTime, transitionCost) {
    const path = new Array(n);
    
    // Son işin en uygun makinesini bul
    let minVal = Infinity;
    let lastMachine = 0;
    for (let j = 0; j < m; j++) {
        if (dp[n - 1][j] < minVal) {
            minVal = dp[n - 1][j];
            lastMachine = j;
        }
    }
    path[n - 1] = lastMachine;
    
    // Geriye doğru giderek her işin hangi makinede yapıldığını bul
    for (let i = n - 1; i > 0; i--) {
        let minVal = Infinity;
        let bestMachine = 0;
        
        for (let k = 0; k < m; k++) {
            const cost = dp[i - 1][k] + transitionCost[k][path[i]] + processingTime[i][path[i]];
            if (cost < minVal) {
                minVal = cost;
                bestMachine = k;
            }
        }
        
        path[i - 1] = bestMachine;
    }
    
    return path;
}

/**

 * @param {number} m - Makine sayısı
 * @param {number[][]} processingTime - İşlerin her makinede işlenme süreleri
 * @param {number[][]} transitionCost - Makineler arası geçiş maliyetleri
 * @returns {number} Minimum toplam süre
 */
function minTotalTimeMemorization(n, m, processingTime, transitionCost) {
    // Giriş doğrulama
    if (!n || !m || !processingTime || !transitionCost) {
        throw new Error("Geçersiz giriş parametreleri");
    }
    
    // Memoization tablosu ve yol takibi
    const memo = Array.from({ length: n }, () => Array(m).fill(-1));
    const pathMemo = Array.from({ length: n }, () => Array(m).fill(-1));
    
    // Her makine için son işin minimum süresini hesapla
    let result = Infinity;
    let finalMachine = 0;
    
    for (let j = 0; j < m; j++) {
        const timeForMachine = dp(n - 1, j);
        if (timeForMachine < result) {
            result = timeForMachine;
            finalMachine = j;
        }
    }
    
    // Optimal yolu oluştur
    const optimalPath = reconstructPath(n, pathMemo, finalMachine);
    
    return {
        minTime: result,
        optimalPath: optimalPath
    };
    
  
    function dp(i, j) {

        if (i === 0) return processingTime[0][j];
        
  
        if (memo[i][j] !== -1) return memo[i][j];
        
        // Minimum değeri hesapla
        let minVal = Infinity;
        let bestPrevMachine = 0;
        
        for (let k = 0; k < m; k++) {
            const cost = dp(i - 1, k) + transitionCost[k][j] + processingTime[i][j];
            if (cost < minVal) {
                minVal = cost;
                bestPrevMachine = k;
            }
        }
        
        // En iyi önceki makineyi kaydet
        pathMemo[i][j] = bestPrevMachine;
        memo[i][j] = minVal;
        return minVal;
    }
    
    // Optimal yolu yeniden oluştur
    function reconstructPath(n, pathMemo, finalMachine) {
        const path = new Array(n);
        path[n - 1] = finalMachine;
        
        for (let i = n - 1; i > 0; i--) {
            path[i - 1] = pathMemo[i][path[i]];
        }
        
        return path;
    }
}

/**
 * Detaylı test sonuçları yazdırma
 * 
 * @param {object} result - Test sonucu (minTime ve optimalPath içeren)
 * @param {number} expected - Beklenen minimum süre
 * @param {string} testName - Test ismi
 */
function printDetailedResult(result, expected, testName) {
    console.log(`\n----- ${testName} -----`);
    console.log(`Minimum toplam süre: ${result.minTime}`);
    if (expected !== null) {
        console.log(`Beklenen süre: ${expected}`);
        console.log(`Sonuç: ${result.minTime === expected ? 'BAŞARILI ✓' : 'BAŞARISIZ ✗'}`);
    }
    
    console.log(`\nOptimal iş-makine ataması:`);
    result.optimalPath.forEach((machine, job) => {
        console.log(`İş ${job + 1}: Makine ${machine + 1}`);
    });
    console.log("-----------------------\n");
}

// -------------------------- TEST ---------------------------- //


testCases();

function testCases() {
    console.log("====== TABLOLAMA (BOTTOM-UP) YAKLAŞIMI ======");
    
    const example1 = {
        n: 3,
        m: 2,
        processingTime: [
            [5, 8],
            [6, 3],
            [4, 7],
        ],
        transitionCost: [
            [0, 2],
            [3, 0],
        ],
        expected: 18,
    };
    
    const result1 = minTotalTime(
        example1.n,
        example1.m,
        example1.processingTime,
        example1.transitionCost
    );
    
    printDetailedResult(result1, example1.expected, "Test 1");
    
    const example2 = {
        n: 4,
        m: 3,
        processingTime: [
            [4, 6, 5],
            [7, 8, 6],
            [5, 4, 3],
            [2, 3, 4],
        ],
        transitionCost: [
            [0, 2, 1],
            [2, 0, 3],
            [1, 3, 0],
        ],
        expected: null, // El ile hesaplanacak
    };
    
    const result2 = minTotalTime(
        example2.n,
        example2.m,
        example2.processingTime,
        example2.transitionCost
    );
    
    printDetailedResult(result2, example2.expected, "Test 2");
    
    // Hesaplama sonucundan elde edilen değeri expected olarak atayalım
    example2.expected = result2.minTime;
    
    console.log("\n====== HAFIZALAMA (TOP-DOWN) YAKLAŞIMI ======");
    
    const result1Memo = minTotalTimeMemorization(
        example1.n,
        example1.m,
        example1.processingTime,
        example1.transitionCost
    );
    
    printDetailedResult(result1Memo, example1.expected, "Test 1 (Memoization)");
    
    const result2Memo = minTotalTimeMemorization(
        example2.n,
        example2.m,
        example2.processingTime,
        example2.transitionCost
    );
    
    printDetailedResult(result2Memo, example2.expected, "Test 2 (Memoization)");
    
    // Sonuçları karşılaştır
    console.log("\n====== YAKLAŞIMLARIN KARŞILAŞTIRILMASI ======");
    console.log(`Test 1: Bottom-up vs Top-down sonuçları ${result1.minTime === result1Memo.minTime ? 'AYNI ✓' : 'FARKLI ✗'}`);
    console.log(`Test 2: Bottom-up vs Top-down sonuçları ${result2.minTime === result2Memo.minTime ? 'AYNI ✓' : 'FARKLI ✗'}`);
    
    // Algoritmanın adım adım çalışmasını göster
    console.log("\n====== ADIM ADIM ALGORİTMA (Örnek 1) ======");
    traceAlgorithm(example1.n, example1.m, example1.processingTime, example1.transitionCost);
}

/**
 * Algoritmanın adım adım çalışmasını gösteren fonksiyon
 * 
 * @param {number} n - İş sayısı
 * @param {number} m - Makine sayısı
 * @param {number[][]} processingTime - İşlerin her makinede işlenme süreleri
 * @param {number[][]} transitionCost - Makineler arası geçiş maliyetleri
 */
function traceAlgorithm(n, m, processingTime, transitionCost) {
    // DP tablosu
    const dp = Array.from({ length: n }, () => Array(m).fill(Infinity));
    
    // İlk iş için başlangıç değerleri
    for (let j = 0; j < m; j++) {
        dp[0][j] = processingTime[0][j];
    }
    
    console.log("Adım 1: İlk işin her makinedeki işlenme süreleri");
    console.log(dp[0]);
    
    // Her iş için DP tablosunu doldur
    for (let i = 1; i < n; i++) {
        console.log(`\nAdım ${i+1}: İş ${i+1} için hesaplamalar`);
        
        for (let j = 0; j < m; j++) {
            console.log(`  İş ${i+1}, Makine ${j+1} için hesaplama:`);
            
            for (let k = 0; k < m; k++) {
                const prevCost = dp[i-1][k];
                const transition = transitionCost[k][j];
                const processing = processingTime[i][j];
                const totalCost = prevCost + transition + processing;
                
                console.log(`    Eğer önceki iş (${i}) Makine ${k+1}'de yapılırsa:`);
                console.log(`      Önceki maliyet: ${prevCost}`);
                console.log(`      Geçiş maliyeti: ${transition}`);
                console.log(`      İşlenme süresi: ${processing}`);
                console.log(`      Toplam maliyet: ${totalCost}`);
                
                if (totalCost < dp[i][j]) {
                    dp[i][j] = totalCost;
                    console.log(`      Yeni minimum: ${dp[i][j]}`);
                }
            }
        }
        
        console.log(`  İş ${i+1} sonrası DP tablosu (satır ${i}):`);
        console.log(dp[i]);
    }
    
    // Son işin minimum maliyeti
    let minFinalCost = Math.min(...dp[n-1]);
    let finalMachine = dp[n-1].indexOf(minFinalCost);
    
    console.log(`\nSonuç: Minimum toplam süre = ${minFinalCost}`);
    console.log(`Son iş (${n}) Makine ${finalMachine+1}'de yapılmalı`);
}

/*
Zaman Karmaşıklığı: O(n * m^2) 
- n adet iş ve m adet makine için, her işte m adet makine için önceki m adet makine deneniyor.

Uzay Karmaşıklığı: O(n * m) 
- DP tablosu n*m boyutundadır.
- Path dizisi n boyutundadır.
*/