# Shop for Good

### For a quick like experience of the product go here: 
https://chromewebstore.google.com/detail/sponsor-circle-affiliate/pifflcabiijbniniffeakhadehjilibi

# Local Development:
- Frontend:`cd Affiliate/Frontend` and `npm start` or `yarn start`
- Backend: `cd Affiliate/backend/functions` and `npm start`
- Enable developers mode in google chrome `Chrome://extensions` and load the google-chorme-extension

- Environments: Envs are set using variables like: `const LOCAL_ENV = true;`. There are 4 of them in different files. Turn them to `true` for production.

# Data flow
![image](https://github.com/user-attachments/assets/6ae1f8fd-d924-47f5-bee4-7facd24ad5f2)


# Google-chrome-extension:
- Everything is baked inside `content.js` its all in one file, since i wasnt able to make import work. It has function Initialize that works as an entery point.
- `Background.js` helps read backgournd tasks such as cookies and establishes connections
- `popup.js` generates logics for popup.html
- `manifest.json` the configuration file.

# Frontend:
- This is a react app that already existed. Our main concern here would be in the directory `extension-onboarding`; All the components used are there.

# Backend:
- It has bunch of functions exported in the index file. There are few that arent used. 
