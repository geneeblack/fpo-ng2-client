import { FpoNg2ClientPage } from './app.po';

describe('fpo-ng2-client App', function() {
  let page: FpoNg2ClientPage;

  beforeEach(() => {
    page = new FpoNg2ClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
