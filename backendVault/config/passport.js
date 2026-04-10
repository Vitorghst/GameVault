const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

async function generateUniqueUsername(baseUsername) {
    const normalizedBase = (baseUsername || 'usuario').trim().replace(/\s+/g, '_');
    let candidate = normalizedBase;
    let counter = 1;

    while (await User.exists({ username: candidate })) {
        candidate = `${normalizedBase}_${counter}`;
        counter += 1;
    }

    return candidate;
}

// Serialização do usuário
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialização
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Estratégia do Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        let user = await User.findOne({
            $or: [
                { googleId: profile.id },
                { email }
            ]
        });
        
        if (!user) {
            const username = await generateUniqueUsername(profile.displayName);

            user = await User.create({
                username,
                email,
                googleId: profile.id,
                avatar: profile.photos[0]?.value
            });
        } else {
            user.googleId = user.googleId || profile.id;
            user.avatar = user.avatar || profile.photos[0]?.value;
            await user.save();
        }
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
