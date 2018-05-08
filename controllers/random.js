const Sequelize = require("sequelize");
const { models } = require("../models");

// GET /quizzes/randomplay
exports.randomplay = (req, res, next) => {

    if (req.session.toBeResolved === undefined) {
        req.session.score = 0;
        let score = req.session.score;
        models.quiz.findAll()
            .then(quizzes => {
                req.session.toBeResolved = quizzes;
                req.session.azar = Math.floor(Math.random() * req.session.toBeResolved.length);
                let azar = req.session.azar;
                let quiz = req.session.toBeResolved[azar];
                res.render('random_play', {
                    quiz: quiz,
                    score: score
                })
            }).catch(error => next(error));
    } else {
        let score = req.session.score;
        req.session.azar = Math.floor(Math.random() * req.session.toBeResolved.length);
        let azar = req.session.azar;
        let quiz = req.session.toBeResolved[azar];
        res.render("random_play", {
            quiz: quiz,
            score: score
        });
    };
};


// GET /quizzes/randomcheck
exports.randomcheck = (req, res, next) => {

    let id = req.params.quizId;
    let respuesta = req.query.answer;
    let quiz = req.session.toBeResolved[id];

    if (respuesta.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
        req.session.score++;
        let score = req.session.score;
        req.session.toBeResolved.splice(id, 1);
        if (req.session.toBeResolved === 0) {
            res.render("random_nomore", {
                score: score
            });
        } else {
            let resultado = true;
            res.render("random_result", {
                answer: respuesta,
                result: resultado,
                score: score
            });
        }
    } else {
        let scoreFin = req.session.score;
        req.session.score = 0;
        req.session.toBeResolved = undefined;
        let resultado = false;
        res.render("random_result", {
            answer: respuesta,
            result: resultado,
            score: scoreFin
        });
    }
};