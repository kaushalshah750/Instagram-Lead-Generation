const {By, Builder, WebElementCondition, until, Key} = require('selenium-webdriver');
const assert = require("assert");

(async function homeTest(){
    let driver;
    try{
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize();

        await driver.get('https://www.instagram.com/')
       
        await driver.findElement(By.name("username")).sendKeys("mrkaushalshah")
        await driver.findElement(By.name("password")).sendKeys("Kaushal$#@#1760")
        
        await driver.findElement(By.className(" _acan _acap _acas _aj1- _ap30")).sendKeys(Key.ENTER)
        
        // Wait for the "Save your login info?" element to be located
        const saveLoginLocator = By.xpath("//*[contains(text(), 'Save your login info?')]");
        
        // Wait up to 10 seconds (10000ms) for the element to be located
        let saveLoginElement = await driver.wait(until.elementLocated(saveLoginLocator), 10000);
        
        // Optionally, wait until the element is visible
        saveLoginElement = await driver.wait(until.elementIsVisible(saveLoginElement), 5000);
        
        // Retrieve the text and assert if needed
        const saveLoginText = await saveLoginElement.getText();

        if(saveLoginText === "Save your login info?"){
            // Wait for the "Not Now" button to be clickable and click it
            // Replace the locator below with the appropriate one for the button.
            const notNowButtonLocator = By.xpath("//*[contains(text(), 'Not now')]");
            const notNowButton = await driver.wait(until.elementLocated(notNowButtonLocator), 10000);
            await driver.wait(until.elementIsVisible(notNowButton), 5000);
            await notNowButton.click();
        }
    
    } catch (e) {
        console.log(e)
    } finally {
        await driver.quit();
    }
}())