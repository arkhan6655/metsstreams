// Detect if running in a WebView (Android/iOS)
function isWebView() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return (
        (userAgent.includes(&quot;Android&quot;) &amp;&amp; userAgent.includes(&quot;wv&quot;)) ||  // Android WebView
        (userAgent.includes(&quot;iPhone&quot;) &amp;&amp; userAgent.includes(&quot;Safari&quot;) === false) // iOS WebView
    );
}

// Hide the ad if in WebView
if (isWebView()) {
    document.getElementById(&#39;sticky-footer-ad&#39;).style.display = &#39;none&#39;;
}

// Close Button Functionality
document.getElementById(&#39;close-ad&#39;).onclick = (e) =&gt; {
    e.stopPropagation(); // Prevents ad click from triggering
    document.getElementById(&#39;sticky-footer-ad&#39;).style.display = &#39;none&#39;;
};