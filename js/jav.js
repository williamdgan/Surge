let obj = JSON.parse(body);
      if (obj.data.splash_ad) {
        obj.data.splash_ad.enabled = false;
        obj.data.splash_ad.overtime = 0;
      }
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`JavDB, 出现异常: ` + error);
