import Script from "next/script";
import React from "react";

const Head = () => {
  return (
    <head>
      <Script>{`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-J46YXTM95N"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-J46YXTM95N');
</script>`}</Script>
    </head>
  );
};

export default Head;
