/** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
// }
module.exports = {
  env: {
    MORALIS_APPLICATION_ID: process.env.MORALIS_APPLICATION_ID,
    MORALIS_SERVER_ID: process.env.MORALIS_SERVER_ID
  },
}