var express = require('express');
var router = express.Router();

/*
 * TOPICTREE ==> ROOT-TOPIC ==> GRADE ==> TOPIC ==> UNIT ==> CONTENT
 * e.g. math/cc-1st-grade-math/cc-1st-geometry/cc-1st-shapes/v/sides-corners
 * e.g. math/cc-1st-grade-math/cc-1st-geometry/cc-1st-shapes/e/attributes-of-shapes
 * e.g. math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-ones-tens/a/adding-1s-and-10s-practice
 */
var topicTreeJson = require('../topictree.json');

// TODO: Implement more content types (Exercise, Article)
/*
 * CONENT TYPES (How to embed):
 * --> VIDEO (Video)
 * --> EXERCISE (Extern Webpage)
 * --> ARTICLE (Extern Webpage)
 */
let contentTypes = {
  video: "Video"
};

/**
 * 
 */
router.get('/', function(req, res, next) {

  let leafNodes = getTopicTreeLeafNodes(topicTreeJson, []);
  let contentNodes = leafNodes.filter(x => Object.values(contentTypes).includes(x.kind)).map(parseContent);

  res.send(contentNodes);
});

/**
 * 
 * @param {*} tree 
 */
function getTopicTreeLeafNodes(node, parents) {
  if( !node.hasOwnProperty("children") ) {
    node.parents = parents;
    return [node];
  }
  return node.children.reduce( (acc, val) => acc.concat( getTopicTreeLeafNodes(val, parents.concat(parseTopic(node))) ), [] );
}

/**
 * 
 * @param {*} node 
 */
function parseTopic(node) {
  return {
    id: node.id,
    translated_title: node.translated_title,
    translated_standalone_title: node.translated_standalone_title,
    description: node.descripotion,
    translated_description: node.translated_description,
    slug: node.slug,
    relative_url: node.relative_url,
    ka_url: node.ka_url
  };
}

/**
 * 
 * @param {*} node 
 */
function parseContent(node) {
  if(node.kind === 'Video') {
    return parseVideo(node);
  }
  /*
  if(node.kind === 'Exercise') {
    return parseExercise(node);
  }
  if(node.kind === 'Article') {
    return parseArticle(node);
  }
  */
}

/**
 * 
 * @param {*} videoNode 
 */
function parseVideo(videoNode) {
  return {
    originId: videoNode.id,
    title: videoNode.title,
    url: videoNode.ka_url,
    description: videoNode.description,
    parents: videoNode.parents
  };
}

module.exports = router;
