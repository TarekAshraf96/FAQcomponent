class FAQ{
    constructor(page, context) {
        // locators
        this.page = page;
        this.context = context;

        this.Question = '.accordion-item-heading-title';
        this.questionsList = '#tab0-tab > div > div.listing-items';
        this.selectAllGroupTab = '#tab0';
        this.selectGroupTab = '.tab';
        this.groupByTabs = '//*[@class = "group-by-tabs"]';
        this.groupByContainer = '.group-by';
        this.groupTabName = '//li[@role="tab"]';
        this.searchField = '.advanced-feed-search-box';
        this.clearAllButton = '.clear-btn.advanced-feed-secondarybutton';
        this.paginationPageSizeDropdown = '.pagination-page-size-select.dozen-advanced-feed-pagination-page-size-select';
        this.sortingDropdown = '.sorting-list-select.dozen-advanced-feed-sorting';
        this.pageNextNavigationButton = '.paginationjs-next.J-paginationjs-next';
        this.mutiSelectFilter = '.select2-selection.select2-selection--multiple';
        this.mutiFilterOption = '//*[@class="select2-results__options"]';
        this.singleSelectFilter = '.select2-selection.select2-selection--single';
        this.singleFiltertOption = '//*[@class = "select2-results__options"]';
        this.collapsedFilterButton = '.dozen-filter-btn.flex.justify-center.items-center.collapse-btn';
        this.selectSecondGroupAccordion = 'tab1-tab';
        this.paginationShowingNumber = '.dozen-paging-wrapper span:nth-child(1)';
        this.paginationTotalEntries = '.dozen-paging-wrapper > div > span:nth-child(2)';
        this.alertNoResultMessage = '.alert.alert-info';
        this.numberOfQuestions = '.accordion-item';
        this.questionAnswer = '.accordion-content';

        //Accordion Locators
        this.accordionHeader = '.tab-panel';
        this.selectAllGroupAccordion = '#tab0-tab';
        this.allGroupAccordionHeader = '//h3[@data-tab-id="0"]';
        this.groupByTabsAccord = '.group-by-tabs';

    }

  async expandQuestion(QNumber) {
      await this.page.locator(this.Question).nth(QNumber).click();
      await this.page.waitForLoadState('networkidle');
    }

    async retriveQuestion(QNumber) {
      return await this.page.locator(this.Question).nth(QNumber).innerText();
    }

    async retriveAnswer(ANumber) {
      return await this.page.locator(this.questionAnswer).nth(ANumber).innerText();
    }

    async chooseAllGroupTab() {
      await this.page.locator(this.selectAllGroupTab).click();
    }

    async sortDescendingly() {
      await this.page.locator(this.sortingDropdown).selectOption({value: '1'});
    }

    async sortAscendingly() {
      await this.page.locator(this.sortingDropdown).selectOption({value: '0'});
    }

    async selectGroupBy(tabNumber) {
      await this.page.locator(this.selectGroupTab).nth(tabNumber).click();
    }

    async selectGroupByName(groupName) {
     await this.page.locator(this.groupByTabs)
      .locator('li',{ hasText: `${groupName}` }).click();
    }

    async retriveGroupByName(tabNumber) {
     return this.page.locator(this.selectGroupTab).nth(tabNumber).innerText();
    }

    async retriveShowingEntries() {
      return this.page.locator(this.paginationShowingNumber).innerText();
     }

     async retriveTotalEntries() {
      return this.page.locator(this.paginationTotalEntries).innerText();
     }

     async searchFieldInput(searchValue) {
      await this.page.locator(this.searchField).type(searchValue);
    }

     async mutiFilterSelect(optionName) {
     await this.page.locator(this.mutiSelectFilter).click();
       await this.page.locator(this.mutiFilterOption)
       .locator('li',{ hasText: `${optionName}` }).click();
     }

     async singleFilterSelect(optionName) {
      await this.page.locator(this.singleSelectFilter).click();
      await this.page.locator(this.singleFiltertOption)
      .locator('li',{ hasText: `${optionName}` }).click();
    }

    async ClearAllFilters() {
      await this.page.locator(this.clearAllButton).click();
    }

    async RetriveNoMatchMessage() {
      //return await this.page.locator(this.alertNoResultMessage).textContent();
      await this.page.waitForSelector(this.alertNoResultMessage, { state: 'visible' });
      return await this.page.locator(this.alertNoResultMessage).textContent();
    }

    async RetriveAnswerStyle(AnsNumber) {
    return await this.page.locator(this.questionAnswer).nth(AnsNumber).getAttribute('style');
    }

    async RetriveSortingOrder() {

        const parentElement = await this.page.$(this.questionsList);
      
        const h3Elements = await parentElement.$$('h3.accordion-item-heading-title');
      
        const textContents = await Promise.all(h3Elements.map(async h3Element => {
          return await h3Element.textContent();
        }));
      
        return textContents;
      }
    

    async CheckGroupByDisplay() {
      // const element = await this.page.locator(this.groupByTabs);
      // if (!element) {
      //     throw new Error(`Could not find element with selector: ${this.groupByTabs}`);
      //     }
      //     const isVisible = await element.isVisible();
      //     return isVisible;
      await this.page.waitForSelector(this.groupByTabs, { state: 'visible' });
      return await this.page.locator(this.groupByTabs);
    }

    async CheckGroupByDisplayAccord() {
      await this.page.waitForSelector(this.groupByTabsAccord, { state: 'visible' });
      return await this.page.locator(this.groupByTabsAccord);
    }

    async pageNextNavigation() {
      await this.page.locator(this.pageNextNavigationButton).click();
    }

    async changePageSize(Size) {
      await this.page.locator(this.paginationPageSizeDropdown).selectOption({value: Size});
    }

    async CountQuestions() {
      await this.page.locator(this.numberOfQuestions).first().waitFor();
      const count = (await this.page.locator(this.numberOfQuestions).count());
      return count;
   }

   //Accordion Function

   async expandAccordion(AccNum) {
    await this.page.locator(this.accordionHeader).nth(AccNum).click();
    await this.page.waitForLoadState('networkidle');

    // await this.page.locator(this.Question).nth(QNumber).click();
    //   await this.page.waitForLoadState('networkidle');
  }

  async retriveHeaderStyle(AccNum) {
    return await this.page.locator(this.accordionHeader).nth(AccNum).getAttribute('class');
    }

    async chooseAllGroupAccordion() {
      await this.page.locator(this.allGroupAccordionHeader).click();
    }

    async accordSelectGroupByName(groupName) {
      await this.page.locator(this.groupByContainer)
       .locator('section',{ hasText: `${groupName}` }).click();
     }

     async checkAccordionisDisplayed() {
      await this.page.waitForSelector(this.selectAllGroupAccordion, { state: 'visible' });
      return await this.page.locator(this.selectAllGroupAccordion);
     }

     async clickCollapsedFilterButton() {
      await this.page.locator(this.collapsedFilterButton).click();
    }
 

}
module.exports = FAQ;