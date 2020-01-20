import React from 'react'
import { graphql, Link } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import { Search } from '../components/Search'
import SEO from '../components/SEO'
import PostLink from '../components/PostLink'
import sortPosts from '../utils/sortPosts'
import getBlurb from '../utils/getBlurb'
import { ENTRIES_PER_PAGE } from '../constants'
import useSiteMetadata from '../hooks/useSiteMetadata'

function MainIndex(props) {
  const { data } = props
  const { title } = useSiteMetadata()
  const posts = data.allMarkdownRemark.edges//.sort(sortPosts)

  return (
    <Layout location={props.location} title={title}>
      <SEO
        title="All posts"
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />
      <Search />
      {posts.map(({ node }) => {
        const { title } = node.frontmatter
        const { listDate, slug } = node.fields
        return (
          <div key={slug}>
            <PostLink slug={slug} title={title} />
            <small>{listDate}</small>
            {getBlurb({ content: node.excerpt, path: slug })}
          </div>
        )
      })}

      {/**
       * TODO:
       * 1. Style better
       * 2. Go directly to the _next_ set of posts (i.e. if this shows 6, show the _second_ 6)
       * 3. Retire the `/blog` page?
       */}
      <Link to={`/blog/1`}>See More</Link>
      <Bio />
    </Layout>
  )
}

export default MainIndex

export const pageQuery = graphql`
  query indexBlogQuery {
    allMarkdownRemark(
      filter: {
        fields: { isPublished: { eq: true }, sourceInstance: { eq: "blog" } }
      }
      # NOTE: limit is the same as ENTRIES_PER_PAGE
      # Cannot use string interpolation in graphql however.
      # limit: 6
    ) {
      edges {
        node {
          excerpt(format: PLAIN)
          fields {
            slug
            # listDate(formatString: "MMMM DD, YYYY")
          }
          frontmatter {
            title
            date
            publish
            updated
          }
        }
      }
    }
  }
`
