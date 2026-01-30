import { Injectable } from '@angular/core';
declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class FacebookService {

  private waitForFB(): Promise<void> {
    return new Promise(resolve => {
      const check = () => {
        if (typeof FB !== 'undefined') resolve();
        else setTimeout(check, 100);
      };
      check();
    });
  }

  async login(): Promise<any> {
    await this.waitForFB();
    return new Promise((resolve, reject) => {
      FB.login(
        (res: any) => res.status === 'connected' ? resolve(res) : reject('Login failed'),
        { 
          scope: 'business_management', 
          auth_type: 'rerequest' 
        }
      );
    });
  }

  async getBusinesses(): Promise<any[]> {
    await this.waitForFB();
    return new Promise(resolve => {
      FB.api('/me/businesses', (res : any) => resolve(res?.data || []));
    });
  }

  async getBusinessPages(businessId: string): Promise<any[]> {
    return new Promise(resolve => {
      FB.api(`/${businessId}/owned_pages`,  (res : any) => {
        resolve(res?.data || [])
      } );
    });
  }

  async getAllPages(): Promise<any[]> {
    return new Promise(resolve => {
      FB.api('/me/accounts', (res : any)  => resolve(res?.data || []));
    });
  }

  async getPagesWithOwnership(): Promise<any[]> {
    const businesses = await this.getBusinesses();
    let ownedPages: any[] = [];
    
    for (const b of businesses) {
      const pages = await this.getBusinessPages(b.id);
      pages.forEach(p => {
        p.__businessId = b.id;
        p.__businessName = b.name;
      });
      ownedPages.push(...pages);
    }

    const allPages = await this.getAllPages();

    return allPages.map(p => {
      const owned = ownedPages.find(op => op.id === p.id);

      return {
        ...p,
        ownership: owned ? 'OWNED' : 'PARTNER',
        businessId: owned?.__businessId || null,
        businessName: owned?.__businessName || null
      };
    });
  }

  async getUserProfile(): Promise<any> {
    await this.waitForFB();
    return new Promise((resolve, reject) => {
      FB.api('/me', { fields: 'id,name,email,picture' }, (res: any) => {
        res && !res.error ? resolve(res) : reject(res.error);
      });
    });
  }

  private hasFullAccess(page: any): boolean {
    if (!page.tasks || !Array.isArray(page.tasks)) return false;
    return page.tasks.includes('MANAGE');
  }

  async getPages(): Promise<any[]> {
    await this.waitForFB();
    return new Promise((resolve, reject) => {
      FB.api('/me/accounts', async (res: any) => {
        if (!res || res.error) return reject(res.error);

        const pages = res.data;

        const pagesFull = await Promise.all(pages.map(async (page: any) => {
          const pageData: any = { ...page };

          pageData.fullAccess = this.hasFullAccess(page);
          pageData.accessLevel = pageData.fullAccess ? 'FULL_ACCESS' : 'LIMITED_ACCESS';

          try {
            pageData.posts = await new Promise((resolvePosts) => {
              FB.api(`/${page.id}/posts?fields=message,created_time,id`, (posts: any) => resolvePosts(posts?.data || []));
            });
          } catch (e) { pageData.posts = []; }

          try {
            pageData.insights = await new Promise((resolveIns) => {
              FB.api(`/${page.id}/insights?metric=page_impressions,page_engaged_users,page_fans`, (ins: any) => resolveIns(ins?.data || []));
            });
          } catch (e) { pageData.insights = []; }

          try {
            pageData.adAccounts = await new Promise((resolveAds) => {
              FB.api(`/${page.id}/adaccounts`, (ads: any) => resolveAds(ads?.data || []));
            });

            pageData.adAccounts = await Promise.all(pageData.adAccounts.map(async (ad: any) => {
              const adAccount: any = { ...ad };
              try {
                adAccount.campaigns = await new Promise((resolveC) => {
                  FB.api(`/${ad.id}/campaigns?fields=id,name,status`, (c: any) => resolveC(c?.data || []));
                });

                adAccount.campaigns = await Promise.all(adAccount.campaigns.map(async (camp: any) => {
                  const campaign: any = { ...camp };
                  try {
                    campaign.adsets = await new Promise((resolveAS) => {
                      FB.api(`/${campaign.id}/adsets?fields=id,name,status,budget_remaining`, (as: any) => resolveAS(as?.data || []));
                    });

                    campaign.adsets = await Promise.all(campaign.adsets.map(async (adset: any) => {
                      const adsetData: any = { ...adset };
                      try {
                        adsetData.ads = await new Promise((resolveAds2) => {
                          FB.api(`/${adset.id}/ads?fields=id,name,status,creative`, (adsRes: any) => resolveAds2(adsRes?.data || []));
                        });
                      } catch (e) { adsetData.ads = []; }
                      return adsetData;
                    }));

                  } catch (e) { campaign.adsets = []; }
                  return campaign;
                }));

              } catch (e) { adAccount.campaigns = []; }
              return adAccount;
            }));

          } catch (e) { pageData.adAccounts = []; }

          return pageData;
        }));

        resolve(pagesFull);
      });
    });
  }

  async getLoginStatus(): Promise<any> {
    await this.waitForFB();
    return new Promise(resolve => FB.getLoginStatus(resolve));
  }
}
