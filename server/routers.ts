import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getCityPhoto } from "./cityPhotos";
import { z } from "zod";
import {
  getContinents,
  getCountriesByContinent,
  getAirportsByCountry,
  getAirportById,
  searchAirports,
} from "./airportData";
import { getWeatherForecast } from "./weatherService";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  airports: router({
    getContinents: publicProcedure.query(() => {
      return getContinents();
    }),

    getCountries: publicProcedure
      .input(z.object({ continent: z.string() }))
      .query(({ input }) => {
        return getCountriesByContinent(input.continent);
      }),

    getAirports: publicProcedure
      .input(
        z.object({
          continent: z.string(),
          country: z.string(),
        })
      )
      .query(({ input }) => {
        return getAirportsByCountry(input.continent, input.country);
      }),

    getAirportById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const airport = await getAirportById(input.id);
        if (airport) {
          return {
            ...airport,
            cityPhoto: getCityPhoto(airport.municipality, airport.id),
          };
        }
        return airport;
      }),

    search: publicProcedure
      .input(
        z.object({
          query: z.string(),
          limit: z.number().optional().default(50),
        })
      )
      .query(({ input }) => {
        return searchAirports(input.query, input.limit);
      }),
  }),

  weather: router({
    getForecast: publicProcedure
      .input(
        z.object({
          latitude: z.number(),
          longitude: z.number(),
        })
      )
      .query(async ({ input }) => {
        return await getWeatherForecast(input.latitude, input.longitude);
      }),
  }),
});

export type AppRouter = typeof appRouter;
