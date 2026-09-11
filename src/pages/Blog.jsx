import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";
import "./Blog.css";

export default function Blog() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Blog</div>
          <h1>Guides on Physiotherapy, Recovery & Pain Relief</h1>
          <p>
            Practical, physiotherapist-written articles on recovering from pain and injury —
            whether you're consulting online or booking a home visit in Chennai.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2 blog-grid">
            {blogPosts
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((post) => (
                <Link to={`/blog/${post.slug}`} className="card blog-card" key={post.slug}>
                  <div className="blog-card-meta">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <div className="tag-row">
                    {post.tags.map((tag) => (
                      <span className="tag-chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="blog-read-more">Read article →</span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
