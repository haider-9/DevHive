import Card from "./Card";

// Sample data for developer posts
const devPosts = [
  {
    profileImage: "https://github.com/microsoft.png",
    username: "Microsoft",
    postHeading: "TypeScript 5.4 Released",
    description: "Exciting new features and improvements in the latest TypeScript release.",
    hashtags: ["typescript", "programming"],
    postImage: "https://miro.medium.com/v2/resize:fit:1400/1*mn6bOs7s6Qbao15PMNRyOA.png",
    createdAt: "2024-03-18T12:00:00Z",
    likeCount: 2345
  },
  {
    profileImage: "https://github.com/facebook.png",
    username: "Meta",
    postHeading: "React 19 Alpha: What's New",
    description: "A sneak peek into the upcoming features of React 19.",
    hashtags: ["react", "frontend"],
    postImage: "https://reactjs.org/logo-og.png",
    createdAt: "2024-03-17T15:30:00Z",
    likeCount: 3210
  },
  {
    profileImage: "https://github.com/golang.png",
    username: "Go Team",
    postHeading: "Go 1.22 Performance Improvements",
    description: "Discover the latest performance enhancements in Go 1.22.",
    hashtags: ["golang", "performance"],
    postImage: "https://go.dev/blog/go1.22.png",
    createdAt: "2024-03-16T09:45:00Z",
    likeCount: 1876
  },
  {
    profileImage: "https://github.com/nodejs.png",
    username: "Node.js",
    postHeading: "Node.js 20 LTS Now Available",
    description: "Long-term support release of Node.js 20 is now ready for production use.",
    hashtags: ["nodejs", "backend"],
    postImage: "https://nodejs.org/static/images/logo-hexagon-card.png",
    createdAt: "2024-03-15T14:20:00Z",
    likeCount: 2789
  },
  {
    profileImage: "https://github.com/rust-lang.png",
    username: "Rust Foundation",
    postHeading: "Rust 1.75 Stabilizes Async Fn in Traits",
    description: "A major milestone for async programming in Rust has been reached.",
    hashtags: ["rust", "programming"],
    postImage: "https://www.rust-lang.org/static/images/rust-social-wide.jpg",
    createdAt: "2024-03-14T11:10:00Z",
    likeCount: 1543
  },
  {
    profileImage: "https://github.com/vercel.png",
    username: "Vercel",
    postHeading: "Next.js 14 Introduces Partial Prerendering",
    description: "Learn about the new partial prerendering feature in Next.js 14.",
    hashtags: ["nextjs", "webdev"],
    postImage: "https://nextjs.org/_next/image?url=%2Fstatic%2Fblog%2Fnext-14%2Fopengraph-image.png&w=1920&q=75",
    createdAt: "2024-03-13T16:55:00Z",
    likeCount: 3098
  },
  {
    profileImage: "https://github.com/kubernetes.png",
    username: "Kubernetes",
    postHeading: "Kubernetes 1.29: What's New",
    description: "Explore the latest features and improvements in Kubernetes 1.29.",
    hashtags: ["kubernetes", "devops"],
    postImage: "https://kubernetes.io/images/kubernetes-horizontal-color.png",
    createdAt: "2024-03-12T10:30:00Z",
    likeCount: 2134
  },
  {
    profileImage: "https://github.com/python.png",
    username: "Python Software Foundation",
    postHeading: "Python 3.12 Release Highlights",
    description: "Check out the key features and improvements in Python 3.12.",
    hashtags: ["python", "programming"],
    postImage: "https://www.python.org/static/community_logos/python-logo-master-v3-TM.png",
    createdAt: "2024-03-11T13:15:00Z",
    likeCount: 2567
  },
  {
    profileImage: "https://github.com/docker.png",
    username: "Docker",
    postHeading: "Docker Desktop Now Supports WASM",
    description: "WebAssembly support comes to Docker Desktop, opening new possibilities.",
    hashtags: ["docker", "wasm"],
    postImage: "https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png",
    createdAt: "2024-03-10T09:00:00Z",
    likeCount: 1987
  },
  {
    profileImage: "https://github.com/aws.png",
    username: "AWS",
    postHeading: "AWS Lambda Now Supports Rust Runtime",
    description: "Rust developers can now build Lambda functions natively on AWS.",
    hashtags: ["aws", "serverless"],
    postImage: "https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB_stacked_REV_SQ.91cd4af40773cbfbd15577a3c2b8a346fe3e8fa2.png",
    createdAt: "2024-03-09T17:40:00Z",
    likeCount: 2876
  },
  {
    profileImage: "https://github.com/graphql.png",
    username: "GraphQL Foundation",
    postHeading: "GraphQL 2024 Roadmap Announced",
    description: "Get a glimpse of what's coming to GraphQL in 2024.",
    hashtags: ["graphql", "api"],
    postImage: "https://graphql.org/img/og-image.png",
    createdAt: "2024-03-08T14:05:00Z",
    likeCount: 1654
  }
];

const FeedSection = ({ posts = devPosts }) => (
  <section className="p-8 flex flex-wrap gap-6 *:basis-[350px] *:flex-1 m-4">
    {posts.map((post, index) => (
      <Card key={index} {...post} />
    ))}
  </section>
);

export default FeedSection;
