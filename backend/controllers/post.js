const sequelize = require('../sequelize');
const fs = require('fs');

// CREER un post
exports.createPost = (req, res) => {
        
    if (req.file) {
        const content = req.body;

        sequelize.models.Post.create({
            ...content,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            commentsCount: 0,
            userId : req.token.userId
        })
            .then(() => {

                return res.status(201).json({ message: "Votre post a bien été publié" });
            })
            .catch(error => {
                console.error(error);

                return res.status(500).json({ message: "Erreur serveur, veuillez réessayer dans quelques minutes." });
            })
        
    } else {

        if (req.body.content === "") {

            return res.status(400).json({ message: "Le contenu du post ne peut pas être vide" });
        } else {
            sequelize.models.Post.create({
                content: req.body.content,
                commentsCount: 0,
                userId : req.token.userId
            })
                .then(() => {
    
                    return res.status(201).json({ message: "Votre post a bien été publié" });
                })
                .catch(error => {
                    console.error(error);
    
                    return res.status(500).json({ message: "Erreur serveur, veuillez réessayer dans quelques minutes." });
                })
        }
    }
    
};

// MODIFIER un post
exports.updatePost = (req, res) => {

    sequelize.models.Post.findOne({ where: { id: req.params.postId } })
        .then((post) => {

            if (parseFloat(req.auth) === post.userId) {
                const upcomingFile = req.file;

                if (upcomingFile && post.imageUrl != null) {
                    const imageToBeDeleted = post.imageUrl.split('/images')[1];

                    post.update({ 
                        content: req.body.content,
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
                    }, { where: { id: req.params.postId } })
                        .then(() => {
                            fs.unlink(`images/${imageToBeDeleted}`, (err) => {
                                if (err) {
                                    console.error(err);
                                }
                              })
                            
                            return res.status(200).json({ message: "Votre post a bien été mis à jour" });
                        })
                        .catch(error => {
                            console.error(error);
                
                            return res.status(404).json({ message: "Erreur de traitement" });
                        })
                } else if (upcomingFile) {
                    post.update({ 
                        content: req.body.content,
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
                    }, { where: { id: req.params.postId } })
                        .then(() => {
                                
                            return res.status(200).json({ message: "Votre post a bien été mis à jour" });
                        })
                        .catch(error => {
                            console.error(error);
                
                            return res.status(404).json({ message: "Erreur de traitement" });
                        })
                } else if (req.body.imageUrl && req.body.imageUrl == "" && post.imageUrl) {
                    const imageToBeDeleted = post.imageUrl.split('/images')[1];
                    fs.unlink(`images/${imageToBeDeleted}`, (err) => {
                        if (err) {
                            console.error(err);
                        }
                        })
                    
                    post.update({ ...req.body }, { where: { id: req.params.postId } })
                        .then(() => {
                            
                            return res.status(200).json({ message: "Votre post a bien été mis à jour" });
                        })
                        .catch(error => {
                            console.error(error);
                
                            return res.status(404).json({ message: "Erreur de traitement" });
                        })
                } else {

                    post.update({ ...req.body }, { where: { id: req.params.postId } })
                        .then(() => {
                            
                            return res.status(200).json({ message: "Votre post a bien été mis à jour" });
                        })
                        .catch(error => {
                            console.error(error);
                
                            return res.status(404).json({ message: "Erreur de traitement" });
                        })
                }
            } else {

                return res.status(403).json({ message: "Requête non autorisée" });
            }

        })
        .catch(error => {
            console.error(error);

            return res.status(500).json({ message: "Erreur serveur, veuillez réessayer dans quelques minutes." });
        })
};

// SUPPRIMER un post
exports.deletePost = (req, res) => {
    console.log("Post ID :", req.params.id);

    sequelize.models.User.findOne({
        where: {
            id: req.auth
        }
    })
        .then(user => {
            console.log("Rôle du user authentifié :", user.role);

            if (user.role === "admin", "moderator" || user.id === req.auth) {
                sequelize.models.Post.findOne({
                    where: { id: req.params.postId }
                })
                    .then(post => {
                        post.destroy();

                        return res.status(200).json({ message: "Cette publication a bien été supprimée" });
                    })
                    .catch(error => {
                        console.error(error);
            
                        return res.status(404).json({ message: "Publication introuvable" });
                    })
            } else {
                console.log("La personne voulant supprimer n'est pas l'auteur")

                return res.status(403).json({ message: "Requête non autorisée" });
            }
        })
        .catch(error => {
            console.error(error);

            return res.status(500).json({ message: "Erreur serveur, veuillez réessayer dans quelques minutes." });
        })

};

// AFFICHER tous les posts (du plus récent au plus ancien)
exports.getAllPosts = (req, res) => {
    sequelize.models.Post.findAll({
        order: [["createdAt", "DESC"]],
        include: [
            sequelize.models.User,
            { 
                model: sequelize.models.Comment,
                include: [
                    sequelize.models.User
                ]
            }
        ]
    })
        .then(posts => {

            return res.status(200).json(posts);
        })
        .catch(error => {
            console.error(error);

            return res.status(500).json({ message: "Erreur serveur, veuillez réessayer dans quelques minutes." });
        })
};