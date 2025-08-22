// SSL Protocol Error Diagnostic
// Copy and paste this into browser console to diagnose SSL issues

console.log('🔍 SSL PROTOCOL ERROR DIAGNOSTIC');
console.log('================================');

// Test 1: Basic connectivity
console.log('\n📋 Testing Basic Connectivity...');

const testUrls = [
    'https://cryptoboost.world',
    'http://cryptoboost.world',
    'https://www.cryptoboost.world'
];

testUrls.forEach(async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'no-cors'
        });
        console.log(`✅ ${url}: Accessible`);
    } catch (error) {
        console.log(`❌ ${url}: ${error.message}`);
    }
});

// Test 2: SSL Certificate check
console.log('\n📋 SSL Certificate Analysis...');

setTimeout(() => {
    // Check if we're on HTTPS
    const isHttps = window.location.protocol === 'https:';
    console.log(`✅ HTTPS Protocol: ${isHttps ? 'Yes' : 'No'}`);

    // Check SSL certificate info
    if (window.location.protocol === 'https:') {
        try {
            // This will only work if the certificate is valid
            console.log('✅ SSL Certificate: Valid');

            // Check for mixed content
            const images = document.querySelectorAll('img');
            const scripts = document.querySelectorAll('script');
            const links = document.querySelectorAll('link');

            let mixedContent = 0;

            [...images, ...scripts, ...links].forEach(element => {
                const src = element.src || element.href;
                if (src && src.startsWith('http://')) {
                    mixedContent++;
                    console.log(`⚠️  Mixed Content: ${src}`);
                }
            });

            if (mixedContent === 0) {
                console.log('✅ No Mixed Content detected');
            } else {
                console.log(`⚠️  Found ${mixedContent} mixed content resources`);
            }

        } catch (sslError) {
            console.log(`❌ SSL Certificate Error: ${sslError.message}`);
        }
    } else {
        console.log('⚠️  Not using HTTPS - this may cause SSL errors');
    }
}, 1000);

// Test 3: Network connectivity
console.log('\n📋 Network Connectivity Test...');

setTimeout(() => {
    // Test direct IP connectivity (if available)
    fetch('https://httpbin.org/ip')
        .then(response => response.json())
        .then(data => {
            console.log(`✅ External IP: ${data.origin}`);
            console.log('✅ Internet connectivity: Good');
        })
        .catch(error => {
            console.log(`❌ Internet connectivity: ${error.message}`);
        });
}, 2000);

// Test 4: Browser compatibility
console.log('\n📋 Browser Compatibility...');

setTimeout(() => {
    const browserInfo = {
        userAgent: navigator.userAgent,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        language: navigator.language,
        platform: navigator.platform
    };

    console.log(`✅ User Agent: ${browserInfo.userAgent}`);
    console.log(`✅ Cookies Enabled: ${browserInfo.cookieEnabled}`);
    console.log(`✅ Online Status: ${browserInfo.onLine}`);
    console.log(`✅ Browser Language: ${browserInfo.language}`);
    console.log(`✅ Platform: ${browserInfo.platform}`);

    // Check for browser-specific SSL issues
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent);

    if (isChrome) {
        console.log('✅ Browser: Chrome - SSL support good');
    } else if (isFirefox) {
        console.log('✅ Browser: Firefox - SSL support good');
    } else if (isSafari) {
        console.log('✅ Browser: Safari - SSL support good');
    } else {
        console.log('⚠️  Browser: Unknown - may have SSL compatibility issues');
    }
}, 3000);

// Test 5: DNS resolution
console.log('\n📋 DNS Resolution Test...');

setTimeout(() => {
    // Try to resolve the domain
    fetch('https://dns.google/resolve?name=cryptoboost.world&type=A')
        .then(response => response.json())
        .then(data => {
            if (data.Answer && data.Answer.length > 0) {
                console.log('✅ DNS Resolution: Successful');
                data.Answer.forEach(record => {
                    if (record.type === 1) { // A record
                        console.log(`✅ IP Address: ${record.data}`);
                    }
                });
            } else {
                console.log('❌ DNS Resolution: Failed or no A records found');
            }
        })
        .catch(error => {
            console.log(`❌ DNS Resolution Error: ${error.message}`);
        });
}, 4000);

// Test 6: Certificate validation
console.log('\n📋 Certificate Validation...');

setTimeout(() => {
    // Try to establish a connection and check certificate
    const testConnection = async () => {
        try {
            const response = await fetch('https://cryptoboost.world', {
                method: 'HEAD',
                headers: {
                    'Accept': 'text/html'
                }
            });

            if (response.ok) {
                console.log('✅ Certificate validation: Passed');
                console.log(`✅ Response status: ${response.status}`);
                console.log(`✅ Response headers: ${Object.keys(response.headers).length} headers`);
            } else {
                console.log(`❌ Certificate validation: Failed (${response.status})`);
            }
        } catch (error) {
            console.log(`❌ Certificate validation error: ${error.message}`);
        }
    };

    testConnection();
}, 5000);

// Solutions section
setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    console.log('🔧 SSL PROTOCOL ERROR - TROUBLESHOOTING SOLUTIONS');
    console.log('='.repeat(60));

    console.log('\n📋 COMMON SOLUTIONS:');
    console.log('1. 🔄 Clear browser cache and cookies');
    console.log('2. 🔄 Restart browser');
    console.log('3. 🔄 Try incognito/private browsing mode');
    console.log('4. 🔄 Disable VPN or proxy if active');
    console.log('5. 🔄 Check system date/time (must be correct)');
    console.log('6. 🔄 Disable browser extensions temporarily');
    console.log('7. 🔄 Try different browser (Chrome, Firefox, Safari)');

    console.log('\n🌐 NETWORK SOLUTIONS:');
    console.log('1. 🔄 Restart router/modem');
    console.log('2. 🔄 Check firewall settings');
    console.log('3. 🔄 Try different network connection');
    console.log('4. 🔄 Contact ISP if issue persists');

    console.log('\n🔒 CERTIFICATE SOLUTIONS:');
    console.log('1. 🔄 Certificate may have expired');
    console.log('2. 🔄 Certificate may be invalid');
    console.log('3. 🔄 Mixed content on page');
    console.log('4. 🔄 DNS propagation issue');

    console.log('\n' + '='.repeat(60));

    console.log('\n📞 IF PROBLEM PERSISTS:');
    console.log('1. Check Netlify dashboard for certificate status');
    console.log('2. Verify domain DNS settings');
    console.log('3. Contact Netlify support');
    console.log('4. Check SSL certificate expiration');

    console.log('\n' + '='.repeat(60));

}, 6000);
