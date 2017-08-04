const express = require('express');
const router = express.Router();
const http = require('http');
const rpn = require('request-promise-native');

const _uniqBy = require('lodash').uniqBy;
const _filter = require('lodash').filter;

/*
 * TOPICTREE ==> ROOT-TOPIC ==> GRADE ==> TOPIC ==> UNIT ==> CONTENT
 * e.g. math/cc-1st-grade-math/cc-1st-geometry/cc-1st-shapes/v/sides-corners
 * e.g. math/cc-1st-grade-math/cc-1st-geometry/cc-1st-shapes/e/attributes-of-shapes
 * e.g. math/cc-1st-grade-math/cc-1st-add-subtract/cc-1st-add-ones-tens/a/adding-1s-and-10s-practice
 */
const topicTreeJson = require('../topictree.json');

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
router.get('/', function (req, res, next) {

    // Parse Topic Tree
    let leafNodes = getTopicTreeLeafNodes(topicTreeJson, []);
    let contentNodes = leafNodes.filter(x => Object.values(contentTypes).includes(x.kind)).map(parseContent);

    // Remove Duplicates
    contentNodes = _uniqBy(contentNodes, 'originId');

    //
    const httpAgent = new http.Agent();
    httpAgent.maxSockets = 50;
    //
    let requestPromises = contentNodes.map(contentNode => {
        return rpn({
            method: 'POST',
            uri: 'http://MacBook-Pro.local:4040/content',
            json: contentNode,
            resolveWithFullResponse: true,
            auth: {
                user: process.env.CONTENT_USER,
                pass: process.env.CONTENT_PASSWORD
            },
            pool: httpAgent,
            timeout: 1500,
            time: true
        }).catch();
    });

    const toResultObject = (promise) => {
        return promise
            .then(request => ({success: true, request}))
            .catch(request => ({success: false, request}));
    };

    Promise.all(requestPromises.map(toResultObject)).then(resultObjects => {
        
        let successful = _filter(resultObjects, {success: true});
        let failed = _filter(resultObjects, {success: false});
        
        res.send({
            successful: {
                count: successful.length,
            },
            failed: {
                count: failed.length,
            }
        });
    });

});

/**
 *
 * @param {*} tree
 */
function getTopicTreeLeafNodes(node, parents) {
    if (!node.hasOwnProperty("children")) {
        node.parents = parents;
        return [node];
    }
    return node.children.reduce((acc, val) => acc.concat(getTopicTreeLeafNodes(val, parents.concat(parseTopic(node)))), []);
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
        //
        translated_youtube_id: node.translated_youtube_id,
        //
        description: node.description,
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
    if (node.kind === 'Video') {
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

    let subject = videoNode.parents[1].translated_title;
    let tags = videoNode.parents.map(x => x.translated_title).reduce((x, y) => x.concat(y), []);

    let youtubeThumbnail = `https://img.youtube.com/vi/${videoNode.translated_youtube_id}/maxresdefault.jpg`;

    return {

        originId: videoNode.id,
        providerName: "Khan Academy",

        url: videoNode.ka_url,
        title: videoNode.title,
        description: videoNode.translated_description || videoNode.description ||
        videoNode.translated_description_html || videoNode.description_html || "No Description",
        thumbnail: youtubeThumbnail,

        contentCategory: 'atomic',
        subject: subject,
        tags: tags,
        mimeType: 'video',
        licenses: [videoNode.license_name],

    };
}

/*
function parseExercise(exerciseNode) {
  return { }
}
*/

/*
function parseArticle(articleNode) {
  return { }
}
*/

module.exports = router;
