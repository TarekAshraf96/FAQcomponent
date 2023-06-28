const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');
//const randomString = require('randomstring');
const CDFAQPage = require('../../Pages/Components/FAQ');
const Environment = require('../../Data/Environment.json');
const CDLoginPage = require('../../Pages/CDLogin.page');

let cdPage;
let cdContext;
let browser;
let cdState;
let FAQPage;
let cdMobPage;
let cdMobContext;
// Below Values are for 'Expand Question in the FAQ' and 'Search Filter in the FAQ' Tests
const G1 = {expectedQuestion: 'From what is the Mexican dish huevos rancheros made?',
            expectedAnswer: 'Baked Egg',
            hiddenValue: "display: none",
            expandedValue: "",
            expectedShowingEntries: '1 - 1', 
            expectedTotalEntries: '1', 
            searchKeyword: "Mexican"};
/* Below Values are for 'Select a Group Tab in the FAQ', 'Multi Filter Filtering in the FAQ', 
'Clear All Filters in the FAQ' and 'Single Filter Filtering in the FAQ' Tests*/
const G2 = { expectedGroupName: 'Society & Culture',
             expectedShowingEntries: '1 - 2',
             expectedTotalEntries: '2', 
             expectedGroupQuestion: 'What is the name of the Hindu god of preservation?',
             expectedGroupAnswer: 'Vishnu',
             filterOption1: 'Geography', 
             filterOption2: 'Film & TV', 
             filterQuestion1: 'What is the plot of the movie Hacksaw Ridge?', 
             filterAnswer1: 'An Army Medic refuses to kill and receives the Medal of Honor without firing a shot.',
             expectedShowingEntries1: '1 - 2', 
             expectedTotalEntries1:'2',
             filterQuestion2: 'Halifax is the capital of which Canadian province?',
             filterAnswer2: 'Nova Scotia',
             expectedShowingEntries2: '1 - 4',
             expectedTotalEntries2: '4',
             singleFilterOption: 'hard',
             selectedSingleGroup: 'Society & Culture',
             SingleGroupShowingEntries: '1 - 1',
             SingleGroupTotalEntries: '1',
             noMatchSearchValue: 'No Result'
            };
// Below Values are for 'Page Navigation in the FAQ' Test
const G3 = {pageNavQuestion: 'Which of these countries borders Germany?',
            PageNavAnswer: 'France',
            mainPageShowingEntries: '1 - 8',
            PageNavShowingEntries: '9 - 10'};

const G4 = {AccExpanded: 'tab-panel·active',
            AccCollapsed: 'tab-panel',
            expectedQuestion:'What is the name of the Hindu god of preservation?',
            expectedAnswer:'Vishnu'};            

// Below Values are for 'Change Page Size in the FAQ' Test
const PageSizeShowingEntries = '1 - 2';
const pageSizeValue = '2';
//const numberOfQuestions = FAQPage.numberOfQuestions;


const devices = [
  {
    name: 'iPhone 12 mini',
    viewport: { width: 375, height: 812 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  },
  {
    name: 'iPhone 14 Pro',
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS <version> like Mac OS X) AppleWebKit/<webkit-version> (KHTML, like Gecko) Version/<version> Mobile/<mobile-version> Safari/<safari-version>', // Replace with the appropriate user agent for iPhone 14 Pro
  },
  {
    name: 'iPad Pro (11 inch)',
    viewport: { width: 834, height: 1194 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS <version> like Mac OS X) AppleWebKit/<webkit-version> (KHTML, like Gecko) Version/<version> Mobile/<mobile-version> Safari/<safari-version>', // Replace with the appropriate user agent for iPad Pro (11 inch)
  },
  {
    name: 'Galaxy A71',
    viewport: { width: 1080, height: 2400 },
    userAgent: 'Mozilla/5.0 (Linux; Android <android-version>; <device-model>) AppleWebKit/<webkit-version> (KHTML, like Gecko) Chrome/<chrome-version> Mobile Safari/<safari-version>', // Replace with the appropriate user agent for Galaxy A71
  },
  {
    name: 'Samsung Tab S7 Plus',
    viewport: { width: 1600, height: 2560 },
    userAgent: 'Mozilla/5.0 (Linux; Android <android-version>; <device-model>) AppleWebKit/<webkit-version> (KHTML, like Gecko) Chrome/<chrome-version> Safari/<safari-version>', // Replace with the appropriate user agent for Samsung Tab S7 Plus
  },
];


test.describe('FAQ Tests', () => {
    test.beforeAll(async () => {
      // getting CD state to pass to the new browsers
      cdState = JSON.parse(fs.readFileSync('CDstate.json'));
    });

    test.beforeEach(async () => {
        // start browsers with the correct states for CM and CD
        test.setTimeout(90000);
        browser = await chromium.launch({headless: false, args: ['--start-maximized'] });
        cdContext = await browser.newContext({ viewport: null, storageState: cdState });
    
        cdPage = await cdContext.newPage();
        FAQPage = new CDFAQPage(cdPage, cdContext);
    
        await cdPage.goto(`${Environment.CDURL}AutoData/Automation FAQ Tabs`, { waitUntil: 'networkidle' });
       
      });

   test('Expand Question in the FAQ', async () => {
    
    const styleValueBefore = (await FAQPage.RetriveAnswerStyle(0));
    expect.soft(styleValueBefore).toContain(G1.hiddenValue);

    await FAQPage.expandQuestion(0);
        
    const styleValueAfter = (await FAQPage.RetriveAnswerStyle(0));
    expect.soft(styleValueAfter).toContain(G1.expandedValue);

    const question = (await FAQPage.retriveQuestion(0));
    expect.soft(question).toContain(G1.expectedQuestion);    

    const answer = (await FAQPage.retriveAnswer(0));
    expect.soft(answer).toContain(G1.expectedAnswer);
        
    });

    test('Sort Questions in the FAQ', async () => {

      const chai = require("chai");
      const expect = chai.expect;
      chai.use(require("chai-sorted"));

      await FAQPage.chooseAllGroupTab();
      await FAQPage.sortDescendingly();

      const retrievedOrderDesc = (await FAQPage.RetriveSortingOrder());
      await expect(retrievedOrderDesc).to.be.sorted({descending: true});
      
      await FAQPage.sortAscendingly();

      const retrivedOrderAsce = (await FAQPage.RetriveSortingOrder());
      await chai.expect(retrivedOrderAsce).to.be.sorted({descending: false})

    });


    test('Select a Group Tab in the FAQ', async () => {

      await FAQPage.selectGroupBy(1);

      const groupTabName = (await FAQPage.retriveGroupByName(1));
      expect.soft(groupTabName).toContain(G2.expectedGroupName);

      const groupShowingEntries = (await FAQPage.retriveShowingEntries());
      expect.soft(groupShowingEntries).toContain(G2.expectedShowingEntries);

      const groupTotalEntries = (await FAQPage.retriveTotalEntries());
      expect.soft(groupTotalEntries).toContain(G2.expectedTotalEntries);

      await FAQPage.expandQuestion(0);

    const question = (await FAQPage.retriveQuestion(0));
    expect.soft(question).toContain(G2.expectedGroupQuestion);    

    const answer = (await FAQPage.retriveAnswer(0));
    expect.soft(answer).toContain(G2.expectedGroupAnswer);

    });

    test('Search Filter in the FAQ', async () => {

      await FAQPage.selectGroupBy(5);
      
      await FAQPage.searchFieldInput(G1.searchKeyword);

    const question = (await FAQPage.retriveQuestion(0));
    expect.soft(question).toContain(G1.expectedQuestion);    

    const answer = (await FAQPage.retriveAnswer(0));
    expect.soft(answer).toContain(G1.expectedAnswer);

    const groupShowingEntries = (await FAQPage.retriveShowingEntries());
    expect.soft(groupShowingEntries).toContain(G1.expectedShowingEntries);

    const groupTotalEntries = (await FAQPage.retriveTotalEntries());
    expect.soft(groupTotalEntries).toContain(G1.expectedTotalEntries);

    });

    test('Multi Filter Filtering in the FAQ', async () => {

      await FAQPage.mutiFilterSelect(G2.filterOption1);

      await FAQPage.mutiFilterSelect(G2.filterOption2);

      await FAQPage.selectGroupByName(G2.filterOption2);

      const question = (await FAQPage.retriveQuestion(0));
      expect.soft(question).toContain(G2.filterQuestion1);

      const answer = (await FAQPage.retriveAnswer(0));
      expect.soft(answer).toContain(G2.filterAnswer1);

    const groupShowingEntries = (await FAQPage.retriveShowingEntries());
    expect.soft(groupShowingEntries).toContain(G2.expectedShowingEntries1);

    const groupTotalEntries = (await FAQPage.retriveTotalEntries());
    expect.soft(groupTotalEntries).toContain(G2.expectedTotalEntries1);

    await FAQPage.selectGroupByName(G2.filterOption1);

    const question2 = (await FAQPage.retriveQuestion(0));
    expect.soft(question2).toContain(G2.filterQuestion2);

    const answer2 = (await FAQPage.retriveAnswer(0));
    expect.soft(answer2).toContain(G2.filterAnswer2);

    const groupShowingEntries2 = (await FAQPage.retriveShowingEntries());
    expect.soft(groupShowingEntries2).toContain(G2.expectedShowingEntries2);

    const groupTotalEntries2 = (await FAQPage.retriveTotalEntries());
    expect.soft(groupTotalEntries2).toContain(G2.expectedTotalEntries2);

    });

    test('Single Filter Filtering in the FAQ', async () => {

    await FAQPage.singleFilterSelect(G2.singleFilterOption);

    await FAQPage.selectGroupByName(G2.selectedSingleGroup);

    const question = (await FAQPage.retriveQuestion(0));
    expect.soft(question).toContain(G2.expectedGroupQuestion);

    const answer = (await FAQPage.retriveAnswer(0));
    expect.soft(answer).toContain(G2.expectedGroupAnswer);

    const groupShowingEntries = (await FAQPage.retriveShowingEntries());
    expect.soft(groupShowingEntries).toContain(G2.SingleGroupShowingEntries);

    const groupTotalEntries = (await FAQPage.retriveTotalEntries());
    expect.soft(groupTotalEntries).toContain(G2.SingleGroupTotalEntries);

    });

    test('Clear All Filters in the FAQ', async () => {
      //const groupByTabs= FAQPage.groupByTabs;

      await FAQPage.searchFieldInput(G2.noMatchSearchValue);

      await FAQPage.singleFilterSelect(G2.singleFilterOption);

      await FAQPage.mutiFilterSelect(G2.filterOption1);
      await FAQPage.mutiFilterSelect(G2.filterOption2);

      const textContent = await FAQPage.RetriveNoMatchMessage();
      await expect(textContent).toContain('No Results found , please change a few things up and try submitting again.');
      
      await FAQPage.ClearAllFilters();

      const groupByTabs = await FAQPage.CheckGroupByDisplay();
      await expect(groupByTabs).toBeVisible();

    });

    test('Page Navigation in the FAQ', async () => {

      const PageShowingEntries = (await FAQPage.retriveShowingEntries());
      expect.soft(PageShowingEntries).toContain(G3.mainPageShowingEntries);

      await FAQPage.pageNextNavigation();

      const NavShowingEntries = (await FAQPage.retriveShowingEntries());
      expect.soft(NavShowingEntries).toContain(G3.PageNavShowingEntries);

      const question = (await FAQPage.retriveQuestion(0));
      expect.soft(question).toContain(G3.pageNavQuestion);

      const answer = (await FAQPage.retriveAnswer(0));
      expect.soft(answer).toContain(G3.PageNavAnswer);

    });


    test('Change Questions Total number in the FAQ', async () => {

      await FAQPage.changePageSize(pageSizeValue);

      const ShowingEntries = (await FAQPage.retriveShowingEntries());
      expect.soft(ShowingEntries).toContain(PageSizeShowingEntries);

      const count = await FAQPage.CountQuestions();
      expect.soft(count).toBe(Number(pageSizeValue));

    });

    test('Expand an Accordion Group in the FAQ', async () => {
      await cdPage.goto(`${Environment.CDURL}/AutoData/Automation FAQ Accordion`, { waitUntil: 'networkidle' });
      
      const styleValueBefore = (await FAQPage.retriveHeaderStyle(1));
      expect.soft(styleValueBefore).toContain(G4.AccCollapsed);

      await FAQPage.expandAccordion(1);

      const styleValueafter = (await FAQPage.retriveHeaderStyle(1));
      expect.soft(styleValueafter).not.toBe(G4.AccExpanded);
    });

    test('Expand a Question in an Accordion Group in the FAQ', async () => {
      await cdPage.goto(`${Environment.CDURL}/AutoData/Automation FAQ Accordion`, { waitUntil: 'networkidle' });
      
      const styleValueBefore = (await FAQPage.retriveHeaderStyle(1));
      expect.soft(styleValueBefore).toContain(G4.AccCollapsed);

      await FAQPage.expandAccordion(1);

      const styleValueafter = (await FAQPage.retriveHeaderStyle(1));
      expect.soft(styleValueafter).not.toBe(G4.AccExpanded);

      const questionStyleBefore = (await FAQPage.RetriveAnswerStyle(0));
      expect.soft(questionStyleBefore).toContain(G1.hiddenValue);

      await FAQPage.expandQuestion(0);
        
      const questionStyleAfter = (await FAQPage.RetriveAnswerStyle(0));
      expect.soft(questionStyleAfter).toContain(G1.expandedValue);

      const question = (await FAQPage.retriveQuestion(0));
      expect.soft(question).toContain(G4.expectedQuestion);    

      const answer = (await FAQPage.retriveAnswer(0));
      expect.soft(answer).toContain(G4.expectedAnswer);
    });

    test('Search Filter in the Accordion FAQ', async () => {
      await cdPage.goto(`${Environment.CDURL}/AutoData/Automation FAQ Accordion`, { waitUntil: 'networkidle' });

      await FAQPage.expandAccordion(5);

      await FAQPage.searchFieldInput(G1.searchKeyword);

    const question = (await FAQPage.retriveQuestion(0));
    expect.soft(question).toContain(G1.expectedQuestion);    

    const answer = (await FAQPage.retriveAnswer(0));
    expect.soft(answer).toContain(G1.expectedAnswer);

    const groupShowingEntries = (await FAQPage.retriveShowingEntries());
    expect.soft(groupShowingEntries).toContain(G1.expectedShowingEntries);

    const groupTotalEntries = (await FAQPage.retriveTotalEntries());
    expect.soft(groupTotalEntries).toContain(G1.expectedTotalEntries);

    });

    test('Multi Filter Filtering in the Accordion FAQ', async () => {
      await cdPage.goto(`${Environment.CDURL}/AutoData/Automation FAQ Accordion`, { waitUntil: 'networkidle' });

      await FAQPage.clickCollapsedFilterButton();

      await FAQPage.mutiFilterSelect(G2.filterOption1);

      await FAQPage.mutiFilterSelect(G2.filterOption2);

      await FAQPage.accordSelectGroupByName(G2.filterOption2);

      const question = (await FAQPage.retriveQuestion(0));
      expect.soft(question).toContain(G2.filterQuestion1);

      const answer = (await FAQPage.retriveAnswer(0));
      expect.soft(answer).toContain(G2.filterAnswer1);

    const groupShowingEntries = (await FAQPage.retriveShowingEntries());
    expect.soft(groupShowingEntries).toContain(G2.expectedShowingEntries1);

    const groupTotalEntries = (await FAQPage.retriveTotalEntries());
    expect.soft(groupTotalEntries).toContain(G2.expectedTotalEntries1);

    await FAQPage.accordSelectGroupByName(G2.filterOption1);

    const question2 = (await FAQPage.retriveQuestion(0));
    expect.soft(question2).toContain(G2.filterQuestion2);

    const answer2 = (await FAQPage.retriveAnswer(0));
    expect.soft(answer2).toContain(G2.filterAnswer2);

    const groupShowingEntries2 = (await FAQPage.retriveShowingEntries());
    expect.soft(groupShowingEntries2).toContain(G2.expectedShowingEntries2);

    const groupTotalEntries2 = (await FAQPage.retriveTotalEntries());
    expect.soft(groupTotalEntries2).toContain(G2.expectedTotalEntries2);

    });

    test('Single Filter Filtering in the Accordion FAQ', async () => {
      await cdPage.goto(`${Environment.CDURL}/AutoData/Automation FAQ Accordion`, { waitUntil: 'networkidle' });

      await FAQPage.clickCollapsedFilterButton();

      await FAQPage.singleFilterSelect(G2.singleFilterOption);
  
      await FAQPage.accordSelectGroupByName(G2.selectedSingleGroup);
  
      const question = (await FAQPage.retriveQuestion(0));
      expect.soft(question).toContain(G2.expectedGroupQuestion);
  
      const answer = (await FAQPage.retriveAnswer(0));
      expect.soft(answer).toContain(G2.expectedGroupAnswer);
  
      const groupShowingEntries = (await FAQPage.retriveShowingEntries());
      expect.soft(groupShowingEntries).toContain(G2.SingleGroupShowingEntries);
  
      const groupTotalEntries = (await FAQPage.retriveTotalEntries());
      expect.soft(groupTotalEntries).toContain(G2.SingleGroupTotalEntries);
  
      });

      test('Clear All Filters in the Accordion FAQ', async () => {
        await cdPage.goto(`${Environment.CDURL}/AutoData/Automation FAQ Accordion`, { waitUntil: 'networkidle' });
       
        await FAQPage.searchFieldInput(G2.noMatchSearchValue);
  
        await FAQPage.clickCollapsedFilterButton();

        await FAQPage.singleFilterSelect(G2.singleFilterOption);
  
        await FAQPage.mutiFilterSelect(G2.filterOption1);
        await FAQPage.mutiFilterSelect(G2.filterOption2);
  
        const textContent = await FAQPage.RetriveNoMatchMessage();
        await expect(textContent).toContain('No Results found , please change a few things up and try submitting again.');
        
        await FAQPage.ClearAllFilters();
        await FAQPage.expandAccordion(1);
       //await cdPage.waitForTimeout(2000);
       //// const groupByTabs = await FAQPage.CheckGroupByDisplayAccord();
        //const textContentAfter = await FAQPage.RetriveNoMatchMessage();
        //await expect(textContentAfter).not.toBeVisible('No Results found , please change a few things up and try submitting again.');
        ////await expect(groupByTabs).toBeVisible();
        const accordion = await FAQPage.checkAccordionisDisplayed();
        await expect(accordion).toBeVisible();
  
      });

    test('Page Navigation inside an Accordion Group in the FAQ', async () => {
      await cdPage.goto(`${Environment.CDURL}/AutoData/Automation FAQ Accordion`, { waitUntil: 'networkidle' });

      const PageShowingEntries = (await FAQPage.retriveShowingEntries());
      expect.soft(PageShowingEntries).toContain(G3.mainPageShowingEntries);

      await FAQPage.pageNextNavigation();

      const NavShowingEntries = (await FAQPage.retriveShowingEntries());
      expect.soft(NavShowingEntries).toContain(G3.PageNavShowingEntries);

      const question = (await FAQPage.retriveQuestion(0));
      expect.soft(question).toContain(G3.pageNavQuestion);

      const answer = (await FAQPage.retriveAnswer(0));
      expect.soft(answer).toContain(G3.PageNavAnswer);

    });

    test('Sort Questions in the Accordion FAQ', async () => {
      await cdPage.goto(`${Environment.CDURL}/AutoData/Automation FAQ Accordion`, { waitUntil: 'networkidle' });

      const chai = require("chai");
      const expect = chai.expect;
      chai.use(require("chai-sorted"));

      await FAQPage.chooseAllGroupAccordion();
      await FAQPage.chooseAllGroupAccordion();

      await FAQPage.sortDescendingly();

      const retrievedOrderDesc = (await FAQPage.RetriveSortingOrder());
      await expect(retrievedOrderDesc).to.be.sorted({descending: true});
      
      await FAQPage.sortAscendingly();

      const retrivedOrderAsce = (await FAQPage.RetriveSortingOrder());
      await chai.expect(retrivedOrderAsce).to.be.sorted({descending: false})

    });

    test('Change Questions Total number in the Accordion FAQ', async () => {
      await cdPage.goto(`${Environment.CDURL}/AutoData/Automation FAQ Accordion`, { waitUntil: 'networkidle' });
      await FAQPage.changePageSize(pageSizeValue);

      const ShowingEntries = (await FAQPage.retriveShowingEntries());
      expect.soft(ShowingEntries).toContain(PageSizeShowingEntries);

      const count = await FAQPage.CountQuestions();
      expect.soft(count).toBe(Number(pageSizeValue));

    });

  test('Test FAQ Tabs View on Responsive', async () => {    
  for (const device of devices) {
    const mobBrowser = await chromium.launch({args: ['--start-maximized'] });
    const cdMobContext = await mobBrowser.newContext({
      viewport: device.viewport,
      userAgent: device.userAgent,
      storageState: cdState,
    });
    const cdMobPage = await cdMobContext.newPage();
    await cdMobPage.goto(`${Environment.CDURL}AutoData/Automation FAQ Tabs`, { waitUntil: 'networkidle' });
    const screenshotPath = `${device.name.replace(/\s+/g, '')}Tabs.png`;
    expect(await cdMobPage.screenshot()).toMatchSnapshot(screenshotPath);

    }
  });


  test('Test FAQ Accordion View on Responsive', async () => {
    for (const device of devices) {
      const mobBrowser = await chromium.launch({args: ['--start-maximized'] });
      const cdMobContext = await mobBrowser.newContext({
        viewport: device.viewport,
        userAgent: device.userAgent,
        storageState: cdState,
      });
      const cdMobPage = await cdMobContext.newPage();
      await cdMobPage.goto(`${Environment.CDURL}AutoData/Automation FAQ Accordion`, { waitUntil: 'networkidle' });
      const screenshotPath = `${device.name.replace(/\s+/g, '')}Accordion.png`;
      expect(await cdMobPage.screenshot()).toMatchSnapshot(screenshotPath);
  
      }
    });
    

    test.afterEach(async () => {
        await browser.close();
      });
});