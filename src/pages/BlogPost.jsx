import { Link, useParams, Navigate } from "react-router-dom";
import { getPostBySlug } from "../data/blogPosts";
import "./Blog.css";

function Block({ block }) {
  if (block.type === "h2") return <h2>{block.text}</h2>;
  if (block.type === "list") {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{block.text}</p>;
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">{post.tags[0]}</div>
          <h1>{post.title}</h1>
          <p className="blog-post-meta">
            {new Date(post.date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.readTime}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container blog-post-content">
          {post.content.map((block, i) => (
            <Block block={block} key={i} />
          ))}

          <div className="blog-post-cta">
            <h3>Have a similar concern?</h3>
            <p>Send a free, no-obligation enquiry and we'll recommend the right next step.</p>
            <Link to="/contact#booking" className="btn btn-primary btn-lg">
              Book a Free Enquiry
            </Link>
          </div>

          <Link to="/blog" className="blog-back-link">
            ← Back to all articles
          </Link>
        </div>
      </section>
    </>
  );
}
