
import "dotenv/config";

async function testFetch() {
  const API_URL = "http://localhost:5000";
  const cat = "Sugar Industry";
  const url = `${API_URL}/articles?category=${encodeURIComponent(cat)}&limit=10`;
  
  console.log("Fetching: " + url);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Status: " + res.status);
    console.log("Count: " + (data.articles ? data.articles.length : "N/A"));
    if (data.articles) {
       data.articles.forEach(a => console.log(` - ${a.title}`));
    }
  } catch (err) {
    console.error("Fetch failed: " + err.message);
  }
}

testFetch();
