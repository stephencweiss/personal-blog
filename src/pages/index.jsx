import React from 'react'
import dayjs from 'dayjs'
import { graphql } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import Header from '../components/Header'
import PostLink from '../components/PostLink'

function sortPosts( a, b) {
  const {publish: aPublish, date: aDate} = a.node.frontmatter
  const {publish: bPublish, date: bDate} = b.node.frontmatter
  let aCompDate = aPublish ? aPublish : aDate
  let bCompDate = bPublish ? bPublish : bDate
  if (!aCompDate || !bCompDate) {
    console.error(`Check frontmatter!`)
    return -1
  }
  return dayjs(aCompDate).isAfter(dayjs(bCompDate)) ? -1 : 1;
}

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges.sort(sortPosts)
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />

        <Header />
        {posts
          .map(({ node }) => {
            const { date, publish, title } = node.frontmatter
            const { slug } = node.fields
            return (
              <div key={slug}>
                <PostLink slug={slug} title={title} />
                <small>{publish ? publish : date}</small>
                <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
              </div>
            )
          })}
        <Bio />
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: {fields: {isPublished: {eq: true}}}) {
      edges {
        node {
          excerpt(format:HTML)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            publish(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`
