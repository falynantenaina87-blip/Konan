import { FunctionReference, anyApi } from "convex/server";

// Mocking the API object structure so imports like api.main.login work
// The actual implementation is handled by the ConvexReactClient converting these path strings.
export const api: any = {
  main: {
    login: "main:login",
    register: "main:register",
    listMessages: "main:listMessages",
    sendMessage: "main:sendMessage",
    getAnnouncements: "main:getAnnouncements",
    createAnnouncement: "main:createAnnouncement",
    getSchedule: "main:getSchedule",
    createScheduleItem: "main:createScheduleItem",
    saveQuizResult: "main:saveQuizResult",
    getUserQuizResults: "main:getUserQuizResults",
  },
  actions: {
    translateText: "actions:translateText",
    generateQuiz: "actions:generateQuiz",
  }
};