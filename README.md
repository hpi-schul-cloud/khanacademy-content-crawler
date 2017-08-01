# khanacademy-content-crawler

[![Dockerhub Automated Build Status](https://img.shields.io/docker/build/schulcloud/khanacademy-content-crawler.svg)](https://hub.docker.com/r/schulcloud/khanacademy-content-crawler/builds/)

A crawler for the khanacademy content

# Khan Academy data structure
The Khan Academy API can be found on [GitHub](https://github.com/Khan/khan-api/wiki/Khan-Academy-API).

> The Khan Academy API gives developers access to nearly all types of Khan Academy data via a RESTful API that outputs easy-to-parse JSON. 

## Topictree
* Endpoint: `https://de.khanacademy.org/api/v1/topictree`
* Structure:
```
TOPICTREE ==> ROOT-TOPIC ==> GRADE ==> TOPIC ==> UNIT ==> CONTENT
e.g. math/cc-1st-grade-math/cc-1st-geometry/cc-1st-shapes/v/sides-corners
e.g. math/cc-1st-grade-math/cc-1st-geometry/cc-1st-shapes/e/attributes-of-shapes
e.g. math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-ones-tens/a/adding-1s-and-10s-practice
```

* Topic Node:
```
{
    "id": "x7a488390",
    "kind": "Topic",
    "ka_url": "https://de.khanacademy.org/math",
    "translated_title": "Mathematik",
    "translated_standalone_title": "Mathematik",
    "translated_description": "Sieh dir die Videos an und erweitere deine Fähigkeiten für fast jedes Mathe-Thema.",
    "standalone_title": "Mathematik",
    "description": "Watch videos and practice your skills for almost any math subject.",
    "slug": "math",
    "domain_slug": "math",
    "relative_url": "/math",
    "children": [ ... ]
    ...
}
```

* Video Node:
```
{
    "id": "x9b4a5e7a",
    "kind": "Video",
    "ka_url": "https://de.khanacademy.org/video/counting-with-small-numbers",
    "title": "Zählen mit kleinen Zahlen",
    "description": "Sunny zählt Eichhörnchen und Pferde. ",
    "node_slug": "v/counting-with-small-numbers",
    "license_name": "CC BY-NC-SA (KA default)",
    "slug": "counting-with-small-numbers",
    ...
}
```

## Content Types
Khan Academy has three content types, but as described in this [issue](https://github.com/Khan/khan-api/issues/121), only the video content type is working.

* Videos
* Exercises
* Articles
 
