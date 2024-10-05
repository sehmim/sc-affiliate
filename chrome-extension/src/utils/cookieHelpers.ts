export function setCookie(name: string, value: any, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export function getCookie(name: string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function getQueryParameter(name: string) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

export function saveClickIdToCookie() {
  const irclickid = getQueryParameter("irclickid");
  const ranMID = getQueryParameter("ranMID");
  const utm_campaign = getQueryParameter("ranMID");

  const clickid = getQueryParameter("clickid");
  const scCoupon = getQueryParameter("sc-coupon");

  if (irclickid) {
      setCookie("sc-irclickid", irclickid, 7);
  }

  if(ranMID) {
    setCookie("sc-ranMID", ranMID, 7);
  }

  if(utm_campaign) {
    setCookie("sc-utm_campaign", utm_campaign, 7);
  }

  if (clickid) {
      setCookie("sc-clickid", clickid, 7);
  }

  if (scCoupon && scCoupon === "activated") {
      setCookie("sc-coupon", scCoupon, 7);
  }
}