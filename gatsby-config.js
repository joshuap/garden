module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-roamresearch`,
      options: {
        url: process.env.ROAM_URL,
        email: process.env.ROAM_EMAIL,
        password: process.env.ROAM_PASSWORD,
      },
    },
  ],
}
