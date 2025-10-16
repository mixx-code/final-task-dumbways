export const cekLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } 

    return res.redirect("/?logMsg=anda belum login, harap login terlebih dahulu");
}