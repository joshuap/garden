module.exports = {
  siteMetadata: {
    title: `Josh's Digital Garden`,
  },
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
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
          `gatsby-remark-double-brackets-link`,
          `gatsby-remark-double-parenthesis-link`,
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              icon: false,
            },
          },
        ],
      },
    },
    `gatsby-transformer-markdown-references`
  ],
}
