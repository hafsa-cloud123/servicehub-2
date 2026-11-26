# MongoDB Atlas Setup (free database in the cloud)

You need a MongoDB database for the backend. The easiest free option is MongoDB Atlas. The Atlas website changes its layout from time to time, so button names may differ slightly.

1. Go to https://www.mongodb.com/cloud/atlas and create a free account.
2. Create a new project, then create a **free cluster** (the free "M0" option). Choose any nearby region.
3. **Database user:** open *Database Access* and add a user with a username and password. Write the password down; you will need it in step 6. Avoid special characters such as `@` or `:` in the password to keep the connection string simple.
4. **Network access:** open *Network Access* and add an IP address. For development, choose "Allow access from anywhere" (`0.0.0.0/0`). This is acceptable for learning, but it should not be used for real production data.
5. On your cluster, click **Connect**, choose **Drivers**, and copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. Put it in `backend/.env` as `MONGO_URI`, replace `<username>` and `<password>` with your own, and add the database name `servicehub` before the `?`:
   `MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/servicehub?retryWrites=true&w=majority`
7. Never commit `.env` to GitHub. It is already listed in `.gitignore`.

**Using local MongoDB instead:** if MongoDB Community Server is installed on your computer, use `MONGO_URI=mongodb://127.0.0.1:27017/servicehub`.

**Common errors**

| Error | Usual cause |
| --- | --- |
| `bad auth` or `Authentication failed` | Wrong username or password in `MONGO_URI` |
| `ECONNREFUSED` or `ENOTFOUND` | Wrong host, no internet, or local MongoDB is not running |
| Connection times out | Your IP address is not allowed in Atlas Network Access |
