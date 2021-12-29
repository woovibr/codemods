import { moveFileToPackage } from '../moveFileToPackage/moveFileToPackageCore';

type MoveConfigFixture = {
  from: string;
  to: string;
};
const moveConfig = ({ from, to }: MoveConfigFixture) => ({
  from,
  fromPackage: 'packages/main',
  to,
  toPackage: 'packages/modules',
  toPackageName: '@repo/modules',
  defaultName: null,
  namespaceName: null,
  softNamedImportFromSource: true,
});

const createResourcePath = 'packages/main/test/createResource';
const modulePath = 'packages/modules/src';

const fixtures = [
  {
    from: `${createResourcePath}/createComplaintExternal`,
    to: `${modulePath}/ombudsman/complaintExternal/fixture/createComplaintExternal`,
  },
  {
    from: `${createResourcePath}/createComplaintExternalAuthorData`,
    to: `${modulePath}/ombudsman/complaintExternal/fixture/createComplaintExternalAuthorData`,
  },
  {
    from: `${createResourcePath}/createComplaintExternalEvent`,
    to: `${modulePath}/ombudsman/complaintExternal/event/fixture/createComplaintExternalEvent`,
  },
  {
    from: `${createResourcePath}/createComplaintFile`,
    to: `${modulePath}/ombudsman/complaintInternal/complaintFile/fixture/createComplaintFile`,
  },
  {
    from: `${createResourcePath}/createComplaintSubject`,
    to: `${modulePath}/ombudsman/complaintInternal/complaintSubject/fixture/createComplaintSubject`,
  },
  {
    from: `${createResourcePath}/createConversation`,
    to: `${modulePath}/conversation/fixture/createConversation`,
  },
  {
    from: `${createResourcePath}/createCustomEmoji`,
    to: `${modulePath}/feedback/userFeedbackReaction/fixture/createCustomEmoji`,
  },
  {
    from: `${createResourcePath}/createCustomProperty`,
    to: `${modulePath}/property/fixture/createCustomProperty`,
  },
  {
    from: `${createResourcePath}/createDataExport`,
    to: `${modulePath}/dataExport/fixture/createDataExport`,
  },
  {
    from: `${createResourcePath}/createDataImport`,
    to: `${modulePath}/dataImport/dataImport/fixture/createDataImport`,
  },
  {
    from: `${createResourcePath}/createDataImportError`,
    to: `${modulePath}/dataImport/dataImportError/fixture/createDataImportError`,
  },
  {
    from: `${createResourcePath}/createDayJourney`,
    to: `${modulePath}/journey/dayJourney/fixture/createDayJourney`,
  },
  {
    from: `${createResourcePath}/createEvent`,
    to: `${modulePath}/events/event/fixture/createEvent`,
  },
  {
    from: `${createResourcePath}/createEventHook`,
    to: `${modulePath}/events/eventHook/fixture/createEventHook`,
  },
  {
    from: `${createResourcePath}/createExternalGroupFeedback`,
    to: `${modulePath}/externalGroupFeedback/fixture/createExternalGroupFeedback`,
  },
  {
    from: `${createResourcePath}/createExternalUserFeedback`,
    to: `${modulePath}/feedback/externalUserFeedback/fixture/createExternalUserFeedback`,
  },
  {
    from: `${createResourcePath}/createFeedUser`,
    to: `${modulePath}/social/feedUser/fixture/createFeedUser`,
  },
  {
    from: `${createResourcePath}/createGoal`,
    to: `${modulePath}/goals/goal/fixture/createGoal`,
  },
  {
    from: `${createResourcePath}/createGoalGroup`,
    to: `${modulePath}/goalGroup/fixture/createGoalGroup`,
  },
  {
    from: `${createResourcePath}/createGoalGroupCostRevenueCenter`,
    to: `${modulePath}/goals/goalGroup/costRevenueCenter/fixture/createGoalGroupCostRevenueCenter`,
  },
  {
    from: `${createResourcePath}/createGoalGroupUser`,
    to: `${modulePath}/goals/goalGroup/user/fixture/createGoalGroupUser`,
  },
  {
    from: `${createResourcePath}/createGoalHistory`,
    to: `${modulePath}/goals/goalHistory/fixture/createGoalHistory`,
  },
  {
    from: `${createResourcePath}/createGoalResultUpdate`,
    to: `${modulePath}/goals/goal/result/fixture/createGoalResultUpdate`,
  },
  {
    from: `${createResourcePath}/createGroup`,
    to: `${modulePath}/group/group/fixture/createGroup`,
  },
  {
    from: `${createResourcePath}/createGroupFeedback`,
    to: `${modulePath}/groupFeedback/fixture/createGroupFeedback`,
  },
  {
    from: `${createResourcePath}/createGroupInterview`,
    to: `${modulePath}/groupInterview/groupInterview/fixture/createGroupInterview`,
  },
  {
    from: `${createResourcePath}/createGroupInterviewRoom`,
    to: `${modulePath}/groupInterview/groupInterviewRoom/fixture/createGroupInterviewRoom`,
  },
  {
    from: `${createResourcePath}/createGroupInterviewRoomAttend`,
    to: `${modulePath}/groupInterview/groupInterviewRoomAttend/fixture/createGroupInterviewRoomAttend`,
  },
  {
    from: `${createResourcePath}/createGroupInvitation`,
    to: `${modulePath}/groupInvitation/fixture/createGroupInvitation`,
  },
  {
    from: `${createResourcePath}/createHeadCount`,
    to: `${modulePath}/headCount/fixture/createHeadCount`,
  },
  {
    from: `${createResourcePath}/createHiringBanner`,
    to: `${modulePath}/hiringBanner/fixture/createHiringBanner`,
  },
  {
    from: `${createResourcePath}/createHiringReferral`,
    to: `${modulePath}/hiringReferral/fixture/createHiringReferral`,
  },
  {
    from: `${createResourcePath}/createIndustry`,
    to: `${modulePath}/industry/fixture/createIndustry`,
  },
  {
    from: `${createResourcePath}/createInterview`,
    to: `${modulePath}/interview/interview/fixture/createInterview`,
  },
  {
    from: `${createResourcePath}/createInterviewSchedule`,
    to: `${modulePath}/interview/interviewSchedule/fixture/createInterviewSchedule`,
  },
  {
    from: `${createResourcePath}/createJobExam`,
    to: `${modulePath}/jobExam/jobExam/fixture/createJobExam`,
  },
  {
    from: `${createResourcePath}/createJobExamCandidateApplication`,
    to: `${modulePath}/jobExam/jobExamCandidateApplication/fixture/createJobExamCandidateApplication`,
  },
  {
    from: `${createResourcePath}/createJobExamQuestion`,
    to: `${modulePath}/jobExam/jobExamQuestion/fixture/createJobExamQuestion`,
  },
  {
    from: `${createResourcePath}/createJobExamQuestionWeight`,
    to: `${modulePath}/jobExam/jobExamQuestion/fixture/createJobExamQuestionWeight`,
  },
  {
    from: `${createResourcePath}/createJobPosting`,
    to: `${modulePath}/jobPosting/fixture/createJobPosting`,
  },
  {
    from: `${createResourcePath}/createJobRequest`,
    to: `${modulePath}/jobRequest/fixture/createJobRequest`,
  },
  {
    from: `${createResourcePath}/createJobRole`,
    to: `${modulePath}/jobRole/fixture/createJobRole`,
  },
  {
    from: `${createResourcePath}/createJourneySchedule`,
    to: `${modulePath}/journey/journeySchedule/fixture/createJourneySchedule`,
  },
  {
    from: `${createResourcePath}/createLandingPage`,
    to: `${modulePath}/landingPage/fixture/createLandingPage`,
  },
  {
    from: `${createResourcePath}/createLike`,
    to: `${modulePath}/social/like/fixture/createLike`,
  },
  {
    from: `${createResourcePath}/createMeeting`,
    to: `${modulePath}/meeting/fixture/createMeeting`,
  },
  {
    from: `${createResourcePath}/createMeetingInvitation`,
    to: `${modulePath}/meetingInvitation/fixture/createMeetingInvitation`,
  },
  {
    from: `${createResourcePath}/createMission`,
    to: `${modulePath}/mission/fixture/createMission`,
  },
  {
    from: `${createResourcePath}/createMotivationalQuote`,
    to: `${modulePath}/motivationalQuote/fixture/createMotivationalQuote`,
  },
  {
    from: `${createResourcePath}/createNineBox`,
    to: `${modulePath}/nineBox/nineBox/fixture/createNineBox`,
  },
  {
    from: `${createResourcePath}/createNineBoxEvaluationRequest`,
    to: `${modulePath}/nineBox/request/fixture/createNineBoxEvaluationRequest`,
  },
  {
    from: `${createResourcePath}/createNineBoxEvaluationScore`,
    to: `${modulePath}/nineBox/score/fixture/createNineBoxEvaluationScore`,
  },
  {
    from: `${createResourcePath}/createNineBoxEvaluationRequest`,
    to: `${modulePath}/nineBox/user/fixture/createNineBoxEvaluationRequest`,
  },
  {
    from: `${createResourcePath}/createNineBoxVersion`,
    to: `${modulePath}/nineBox/nineBoxVersion/fixture/createNineBoxVersion`,
  },
  {
    from: `${createResourcePath}/createOldReaction`,
    to: `${modulePath}/feedback/userFeedbackReaction/fixture/createOldReaction`,
  },
  {
    from: `${createResourcePath}/createOneOnOne`,
    to: `${modulePath}/oneOnOne/userFeedbackOneToOne/fixture/createOneOnOne`,
  },
  {
    from: `${createResourcePath}/createOneOnOneSchedule`,
    to: `${modulePath}/oneOnOne/oneOnOneSchedule/fixture/createOneOnOneSchedule`,
  },
  {
    from: `${createResourcePath}/createPerformanceReview`,
    to: `${modulePath}/performanceReview/performanceReview/fixture/createPerformanceReview`,
  },
  {
    from: `${createResourcePath}/createPollOption`,
    to: `${modulePath}/poll/fixture/createPollOption`,
  },
  {
    from: `${createResourcePath}/createPollQuestion`,
    to: `${modulePath}/poll/fixture/createPollQuestion`,
  },
  {
    from: `${createResourcePath}/createPositionApplication`,
    to: `${modulePath}/positionApplication/fixture/createPositionApplication`,
  },
  {
    from: `${createResourcePath}/createPositionApplicationStatus`,
    to: `${modulePath}/positionApplication/status/fixture/createPositionApplicationStatus`,
  },
  {
    from: `${createResourcePath}/createQuestionOption`,
    to: `${modulePath}/poll/fixture/createQuestionOption`,
  },
  {
    from: `${createResourcePath}/createRatings`,
    to: `${modulePath}/topic/fixture/createRatings`,
  },
  {
    from: `${createResourcePath}/createReaction`,
    to: `${modulePath}/feedback/userFeedbackReaction/fixture/createReaction`,
  },
  {
    from: `${createResourcePath}/createReviewField`,
    to: `${modulePath}/performanceReview/reviewField/fixture/createReviewField`,
  },
  {
    from: `${createResourcePath}/createReviewRequest`,
    to: `${modulePath}/performanceReview/reviewRequest/fixture/createReviewRequest`,
  },
  {
    from: `${createResourcePath}/createReviewScore`,
    to: `${modulePath}/performanceReview/reviewScore/fixture/createReviewScore`,
  },
  {
    from: `${createResourcePath}/createReviewTopic`,
    to: `${modulePath}/performanceReview/reviewTopic/fixture/createReviewTopic`,
  },
  {
    from: `${createResourcePath}/createReviewTopicGroup`,
    to: `${modulePath}/performanceReview/reviewTopic/fixture/createReviewTopicGroup`,
  },
  {
    from: `${createResourcePath}/createSalary`,
    to: `${modulePath}/salary/fixture/createSalary`,
  },
  {
    from: `${createResourcePath}/createSalaryRange`,
    to: `${modulePath}/salaryRange/fixture/createSalaryRange`,
  },
  {
    from: `${createResourcePath}/createSessionToken`,
    to: `${modulePath}/sessionToken/fixture/createSessionToken`,
  },
  {
    from: `${createResourcePath}/createSubscribe`,
    to: `${modulePath}/subscribe/fixture/createSubscribe`,
  },
  {
    from: `${createResourcePath}/createTagModule`,
    to: `${modulePath}/tags/tagModule/fixture/createTagModule`,
  },
  {
    from: `${createResourcePath}/createTopic`,
    to: `${modulePath}/topic/fixture/createTopic`,
  },
  {
    from: `${createResourcePath}/createTriggerGoal`,
    to: `${modulePath}/goals/goal/trigger/fixture/createTriggerGoal`,
  },
  {
    from: `${createResourcePath}/createUserApplication`,
    to: `${modulePath}/userApplication/fixture/createUserApplication`,
  },
  {
    from: `${createResourcePath}/createUserContextDismissed`,
    to: `${modulePath}/context/fixture/createUserContextDismissed`,
  },
  {
    from: `${createResourcePath}/createUserFeedback`,
    to: `${modulePath}/feedback/userFeedback/fixture/createUserFeedback`,
  },
  {
    from: `${createResourcePath}/createUserFeedbackRequest`,
    to: `${modulePath}/feedback/userFeedbackRequest/fixture/createUserFeedbackRequest`,
  },
  {
    from: `${createResourcePath}/createUserGroup`,
    to: `${modulePath}/group/userGroup/fixture/createUserGroup`,
  },
  {
    from: `${createResourcePath}/createUserJourneySchedule`,
    to: `${modulePath}/journey/journeySchedule/fixture/createUserJourneySchedule`,
  },
  {
    from: `${createResourcePath}/createUserManagerTransfer`,
    to: `${modulePath}/userManagerTransfer/fixture/createUserManagerTransfer`,
  },
  {
    from: `${createResourcePath}/createUserNotification`,
    to: `${modulePath}/notification/fixture/createUserNotification`,
  },
  {
    from: `${createResourcePath}/createUserObjective`,
    to: `${modulePath}/src/userObjective/fixture/createUserObjective`,
  },
  {
    from: `${createResourcePath}/createUserPerformanceReview`,
    to: `${modulePath}/performanceReview/fixture/createUserPerformanceReview`,
  },
  {
    from: `${createResourcePath}/createUserPlatformInvitation`,
    to: `${modulePath}/userPlatformInvitation/fixture/createUserPlatformInvitation`,
  },
  {
    from: `${createResourcePath}/createUserSegmentation`,
    to: `${modulePath}/userSegmentation/fixture/createUserSegmentation`,
  },
  {
    from: `${createResourcePath}/createUserSocialAccount`,
    to: `${modulePath}/userSocialAccount/fixture/createUserSocialAccount`,
  },
].map((c) => ({
  from: `${c.from}.ts`,
  to: `${c.to}.ts`,
}));

(async () => {
  try {
    // eslint-disable-next-line
    console.log(`moving ${fixtures.length} fixtures files`);
    for (const fixture of fixtures) {
      const config = moveConfig(fixture);

      // eslint-disable-next-line
      console.log({
        config,
      });

      await moveFileToPackage(config);
    }
  } catch (err) {
    // eslint-disable-next-line
    console.log('e', err);
  }

  process.exit(0);
})();
