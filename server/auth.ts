import { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './config';
import { setting } from './setting';

export function auth(app: Express): RequestHandler {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const hostDomain = process.env.GOOGLE_WORKSPACE_HOST_DOMAIN;
  const callbackURL = `${config.serverUrl}/auth/google/callback`;

  if (clientID == null || clientSecret == null) {
    return (_req: Request, _res: Response, next: NextFunction) => {
      return next();
    };
  }

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user as Express.User));

  passport.use(
    new GoogleStrategy({ clientID, clientSecret, callbackURL }, (_accessToken, _refreshToken, profile, done) => {
      done(null, {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
      });
    })
  );

  app.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'email'], hd: hostDomain }));

  app.get('/auth/google/callback', passport.authenticate('google'), (_req, res) => {
    res.redirect('/');
  });

  function shouldBeAuthenticated(req: Request): boolean {
    const isAuthUrl = req.path.startsWith('/auth/');
    const isExtension = req.path.startsWith('/storage/') && req.query.s === setting.signPath(req.path);
    const isPrefetchUrl = req.path === '/api/stamps/urls';

    return !(isAuthUrl || isExtension || isPrefetchUrl);
  }

  return (req: Request, res: Response, next: NextFunction) => {
    if (shouldBeAuthenticated(req) && !req.isAuthenticated()) {
      return res.redirect('/auth/google');
    } else {
      return next();
    }
  };
}
