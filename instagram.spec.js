const { By, Builder, until, Key } = require('selenium-webdriver');

(async function homeTest() {
    let driver;
    try {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize();

        // Step 1: Login
        await driver.get('https://www.instagram.com/');
        await driver.wait(until.elementLocated(By.name("username")), 10000).sendKeys("mrkaushalshah");
        await driver.findElement(By.name("password")).sendKeys("Kaushal$#@#1760", Key.ENTER);

        // Step 2: Optional "Save Login Info?" Handling
        const saveLoginLocator = By.xpath("//*[contains(text(), 'Save your login info?')]");
        try {
            await driver.wait(until.elementLocated(saveLoginLocator), 10000);
        } catch (err) {
            console.log("Login popup not shown.");
        }

        // Step 3: Go to hashtag search
        await driver.get("https://www.instagram.com/explore/search/keyword/?q=%23onlinetutor");
        await driver.sleep(5000); // Let content load

        const links = await driver.findElements(By.css('a[href^="/p/"]'));
        console.log("***** All Links *****");
        console.log("Total:", links.length);

        const baseTab = await driver.getWindowHandle();

        for (let link of links) {
            try {
                const href = await link.getAttribute('href');
                console.log("Post Link:", href);

                // Open in new tab
                await driver.executeScript("window.open(arguments[0]);", href);
                const tabs = await driver.getAllWindowHandles();
                await driver.switchTo().window(tabs[tabs.length - 1]);

                await driver.sleep(2000); // Let post load

                // Get image URL
                const imgElement = await driver.findElement(By.css('img[alt*="Photo by"]'));
                const imgSrc = await imgElement.getAttribute('src');
                console.log("Image URL:", imgSrc);

                // Get username
                let name = '';
                try {
                    const nameElement = await driver.findElement(By.xpath('//a[contains(@href, "/") and not(contains(@href, "/p/"))]'));
                    name = await nameElement.getText();
                } catch {
                    name = "Username not found.";
                }
                console.log("Username:", name);
                
                // Get caption
                let caption = '';
                try {
                    const captionElement = await driver.findElement(
                        By.xpath('/html/body/div[1]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div/div[1]/div/div[2]/div/div[2]/div/div[1]/div/div[2]/div/span/div/span')
                    );
                    caption = await captionElement.getText();
                } catch (e) {
                    caption = "No caption found.";
                }
                console.log("Caption:", caption);
                                                
                await driver.close();
                await driver.switchTo().window(baseTab);

            } catch (err) {
                console.error("Error scraping post:", err.message);
                const tabs = await driver.getAllWindowHandles();
                if (tabs.length > 1) {
                    await driver.close();
                    await driver.switchTo().window(baseTab);
                }
            }
        }

    } catch (e) {
        console.error("Fatal error:", e);
    } finally {
        // await driver.quit(); // Uncomment when ready
    }
})();
