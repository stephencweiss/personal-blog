import React from 'react'
import { graphql } from 'gatsby'
import { Bio, ColumnLinkWrapper, Layout, SEO, ListedLink } from '../components'

function Lists(props) {
    const { data } = props
    const list = data.lists.edges

    return (
        <Layout>
            <SEO title="Lists" keywords={['reading', 'books']} />
            <h1>lists</h1>
            <p>a list of lists I maintain.</p>
            <ColumnLinkWrapper>
                <ul>
                    {list.map(({ node }) => {
                        const { title, slug } = node.frontmatter
                        const { slug: fieldSlug } = node.fields
                        return (
                            <ListedLink
                                key={slug ?? fieldSlug}
                                to={`/${slug ?? fieldSlug}`}
                            >
                                {title.toLowerCase()}
                            </ListedLink>
                        )
                    })}
                </ul>
            </ColumnLinkWrapper>
            <Bio />
        </Layout>
    )
}

export default Lists

export const pageQuery = graphql`
    query {
        lists: allMarkdownRemark(
            filter: {
                frontmatter: { category: { in: ["lists"] } }
                fields: { sourceInstance: { eq: "notes" } }
            }
        ) {
            edges {
                node {
                    id
                    html
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        slug
                    }
                }
            }
        }
    }
`
