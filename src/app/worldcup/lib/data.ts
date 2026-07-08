// ============ 静态 Mock 数据（与设计稿一致，后续可替换为接口） ============

export type Team = {
  id: string;
  name: string;
  short: string;
  flag: string; // emoji 国旗
  color: string; // 主题色
};

export const teams: Record<string, Team> = {
  bra: { id: "bra", name: "巴西", short: "BRA", flag: "🇧🇷", color: "#ffd700" },
  arg: { id: "arg", name: "阿根廷", short: "ARG", flag: "🇦🇷", color: "#00d2ff" },
  fra: { id: "fra", name: "法国", short: "FRA", flag: "🇫🇷", color: "#0066ff" },
  eng: { id: "eng", name: "英格兰", short: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "#ffffff" },
  esp: { id: "esp", name: "西班牙", short: "ESP", flag: "🇪🇸", color: "#ff6b35" },
  por: { id: "por", name: "葡萄牙", short: "POR", flag: "🇵🇹", color: "#00ff87" },
  ger: { id: "ger", name: "德国", short: "GER", flag: "🇩🇪", color: "#e08a4b" },
  ned: { id: "ned", name: "荷兰", short: "NED", flag: "🇳🇱", color: "#ff3b3b" },
};

export type MatchStatus = "live" | "upcoming" | "finished";

export type Match = {
  id: string;
  stage: string;
  home: Team;
  away: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  kickoff: string; // 显示用时间
  minute?: number; // 直播分钟
  stats?: {
    possession: [number, number]; // 控球率 %
    shots: [number, number];
    corners: [number, number];
  };
};

export const matches: Match[] = [
  {
    id: "m1",
    stage: "半决赛",
    home: teams.bra,
    away: teams.arg,
    homeScore: 2,
    awayScore: 1,
    status: "live",
    kickoff: "03:00",
    minute: 67,
    stats: { possession: [54, 46], shots: [11, 7], corners: [5, 3] },
  },
  {
    id: "m2",
    stage: "半决赛",
    home: teams.fra,
    away: teams.eng,
    homeScore: 1,
    awayScore: 1,
    status: "upcoming",
    kickoff: "今日 06:00",
  },
  {
    id: "m3",
    stage: "1/4 决赛",
    home: teams.esp,
    away: teams.por,
    homeScore: 3,
    awayScore: 2,
    status: "finished",
    kickoff: "昨日 03:00",
  },
  {
    id: "m4",
    stage: "1/4 决赛",
    home: teams.ger,
    away: teams.ned,
    homeScore: 0,
    awayScore: 0,
    status: "upcoming",
    kickoff: "明日 03:00",
  },
];

export type Player = {
  id: string;
  name: string;
  team: Team;
  goals: number;
  assists: number;
  rating: number;
};

export const bestPlayer: Player = {
  id: "p1",
  name: "维尼修斯",
  team: teams.bra,
  goals: 6,
  assists: 3,
  rating: 9.4,
};

export const topScorers: (Player & { rank: number })[] = [
  { id: "p1", name: "维尼修斯", team: teams.bra, goals: 6, assists: 3, rating: 9.4, rank: 1 },
  { id: "p2", name: "姆巴佩", team: teams.fra, goals: 5, assists: 2, rating: 9.1, rank: 2 },
  { id: "p3", name: "梅西", team: teams.arg, goals: 4, assists: 5, rating: 9.0, rank: 3 },
  { id: "p4", name: "贝林厄姆", team: teams.eng, goals: 4, assists: 2, rating: 8.7, rank: 4 },
  { id: "p5", name: "亚马尔", team: teams.esp, goals: 3, assists: 4, rating: 8.6, rank: 5 },
];

export type PredictTeam = { team: Team; support: number }; // support %

export const predictTeams: PredictTeam[] = [
  { team: teams.bra, support: 38 },
  { team: teams.arg, support: 27 },
  { team: teams.fra, support: 19 },
  { team: teams.eng, support: 16 },
];

export type Prize = {
  id: string;
  name: string;
  value: string;
  emoji: string;
  remaining: number;
  total: number;
  tier: "grand" | "mid" | "normal";
};

export const prizes: Prize[] = [
  { id: "pr1", name: "决赛双人门票", value: "¥38,800", emoji: "🎫", remaining: 3, total: 10, tier: "grand" },
  { id: "pr2", name: "签名球衣", value: "¥6,800", emoji: "👕", remaining: 12, total: 30, tier: "mid" },
  { id: "pr3", name: "官方比赛用球", value: "¥1,680", emoji: "⚽", remaining: 28, total: 50, tier: "normal" },
  { id: "pr4", name: "球星卡盲盒", value: "¥399", emoji: "🎁", remaining: 156, total: 300, tier: "normal" },
  { id: "pr5", name: "周边礼包", value: "¥199", emoji: "🛍️", remaining: 480, total: 1000, tier: "normal" },
];

export type LeaderEntry = {
  rank: number;
  name: string;
  score: number;
  flag: string;
  color: string;
};

export const leaderboard: LeaderEntry[] = [
  { rank: 1, name: "绿茵预言家", score: 9820, flag: "🏆", color: "#ffd700" },
  { rank: 2, name: "倒挂金钩", score: 8740, flag: "🥈", color: "#cfd8e3" },
  { rank: 3, name: "帽子戏法", score: 8310, flag: "🥉", color: "#e08a4b" },
  { rank: 4, name: "圆月弯刀", score: 7650, flag: "🏴", color: "#00d2ff" },
  { rank: 5, name: "单刀赴会", score: 7120, flag: "🇦🇷", color: "#00ff87" },
  { rank: 6, name: "铁血后卫", score: 6680, flag: "🇫🇷", color: "#ff6b35" },
  { rank: 7, name: "金手套", score: 6210, flag: "🇧🇷", color: "#ffd700" },
];

export type Task = {
  id: string;
  title: string;
  desc: string;
  reward: string;
  progress: number;
  total: number;
  done: boolean;
};

export const tasks: Task[] = [
  { id: "invite", title: "邀请好友", desc: "邀请1位好友参与活动", reward: "+500积分", progress: 0, total: 1, done: false },
  { id: "watch", title: "观看直播", desc: "观看15分钟赛事直播", reward: "+200积分", progress: 0, total: 1, done: false },
  { id: "share", title: "分享活动", desc: "分享活动到朋友圈", reward: "+100积分", progress: 0, total: 1, done: false },
];

export const signInRewards = [
  { day: 1, reward: "+50" },
  { day: 2, reward: "+100" },
  { day: 3, reward: "+150" },
  { day: 4, reward: "+200" },
  { day: 5, reward: "+250" },
  { day: 6, reward: "+300" },
  { day: 7, reward: "大礼" },
] as const;

export const activityRules = [
  { title: "活动时间", desc: "2026年6月11日 — 2026年7月19日" },
  { title: "参与资格", desc: "所有注册用户均可参与竞猜、点球挑战等互动" },
  { title: "竞猜规则", desc: "选择你预测的冠军球队并投入积分，猜中按支持率倍数返还积分" },
  { title: "点球挑战", desc: "每日5次免费机会，进球得50积分，连续进球有额外奖励" },
  { title: "积分排行", desc: "活动期间累计积分，Top10 获得决赛门票、签名球衣等实物大奖" },
  { title: "奖励发放", desc: "活动结束后7个工作日内，通过站内信通知获奖者并发放奖品" },
] as const;

export type UserPrize = {
  name: string;
  icon: string;
  status: "待揭晓" | "未获得" | "已获得";
};

export const userPrizes: UserPrize[] = [
  { name: "决赛门票", icon: "🎟️", status: "待揭晓" },
  { name: "球星球衣", icon: "👕", status: "未获得" },
  { name: "积分大礼包", icon: "💰", status: "已获得" },
];

export const USER_POINTS = 2480;

export const eventInfo = {
  title: "燃情绿茵",
  subtitle: "决战 2026",
  slogan: "世界杯狂欢 · 竞猜赢大奖",
  targetDate: "2026-06-11T18:00:00Z",
  totalPrize: "¥1,000,000",
};
