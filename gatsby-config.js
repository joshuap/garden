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
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-double-brackets-link`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-double-parenthesis-link`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-transformer-markdown-references`,
      options: {
        types: ["Mdx"],
      },
    },
  ],
}
