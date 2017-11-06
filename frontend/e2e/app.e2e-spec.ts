import { AppPage } from './app.po';

describe('younmeet App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('page should be instantiated', () => {
    expect(page).toBeTruthy();
  })
  /*
  it('should show login page', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toContain('Login');
  });
  */
});
