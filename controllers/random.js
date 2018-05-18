const Sequelize = require("sequelize");
const {
    models
} = require("../models");

// GET /quizzes/randomplay
exports.randomplay = (req, res, next) => {

    if (req.session.toBeResolved === [] || undefined) {
        req.session.score = 0;
        models.quiz.findAll()
            .then(quizzes => {
                req.session.toBeResolved = quizzes;
                let azar = Math.floor(Math.random() * quizzes.length);
                let quiz = req.session.toBeResolved[azar];
                req.session.toBeResolved.splice(azar, 1);
                const {
                    query
                } = req;
                const answer = query.answer || '';
                let score = req.session.score;
                res.render('random_play', {
                    quiz,
                    answer,
                    score,
                })
            }).catch(error => next(error));
    } else {
        let azar = Math.floor(Math.random() * req.session.toBeResolved.length);
        let quiz = req.session.toBeResolved[azar];
        req.session.toBeResolved.splice(azar, 1);
        const {
            query
        } = req;
        const answer = query.answer || '';
        let score = req.session.score;
        res.render("random_play", {
            quiz,
            score
        });
    };
};


// GET /quizzes/randomcheck
exports.randomcheck = (req, res, next) => {

    const {quiz, query} = req;
    const answer = query.answer || "";
    const result = answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim();

    if (result === true) {
        req.session.score++;
        let score = req.session.score;
        if (req.session.toBeResolved.length === 0) {
            req.session.score = 0;
            req.session.toBeResolved = [];
            res.render("random_nomore", {
                score
            });
        } else {
            res.render("random_result", {
                answer,
                result,
                score
            });
        }
    } else {
        req.session.score = 0;
        req.session.toBeResolved = [];
        res.render("random_result", {
            answer,
            result,
            score
        });
    }
};