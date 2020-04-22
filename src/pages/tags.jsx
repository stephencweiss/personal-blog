import React from 'react'
import { Layout, SEO, ListedLink } from '../components'
import kebabCase from 'lodash/kebabCase'
import useSiteMetadata from '../hooks/useSiteMetadata'
import { graphql } from 'gatsby'

// TODO: Create groupings for the tags by letter (and have an internal link help jump between them)
// TODO: Allow a sort of the tags; a->z, z->a, and count ASC/DESC

const TagsPage = props => {
    const { group } = props.data.allMarkdownRemark
    const { title: siteTitle } = useSiteMetadata()

    return (
        <Layout location={props.location} title={siteTitle}>
            <SEO title="Tags" />
            <div>
                <div>
                    <h1>Tags</h1>
                    <ul>
                        {group.map(tag => (
                            <ListedLink
                                to={`/tags/${kebabCase(tag.fieldValue)}/`}
                                key={tag.fieldValue}
                            >
                                {tag.fieldValue} ({tag.totalCount})
                            </ListedLink>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    )
}

export default TagsPage

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(limit: 2000) {
            group(field: frontmatter___tags) {
                fieldValue
                totalCount
            }
        }
    }
`
