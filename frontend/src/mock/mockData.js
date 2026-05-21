let mockPlants = [
  {
    id: "plant_1",
    name: "Монстера деликатная",
    latin: "Monstera deliciosa",
    photo_url: null,
    next_water: new Date().toISOString().slice(0, 10),
    status: "needs_water",
  },
  {
    id: "plant_2",
    name: "Кактус опунция",
    latin: "Opuntia microdasys",
    photo_url: null,
    next_water: "2026-06-01",
    status: "healthy",
  },
  {
    id: "plant_3",
    name: "Фикус Бенджамина",
    latin: "Ficus benjamina",
    photo_url: null,
    next_water: new Date().toISOString().slice(0, 10),
    status: "sick",
  },
];


export const getMockCollection = () => ({ plants: [...mockPlants] });

export const addMockPlant = (plantData) => {
  const newPlant = {
    id: `plant_${Date.now()}`,
    name:       plantData.plant_name,
    latin:      plantData.latin ?? "",
    photo_url:  plantData.photo_url ?? null,
    next_water: plantData.next_water ?? new Date().toISOString().slice(0, 10),
    status:     "healthy",
  };
  mockPlants.push(newPlant);
  return { id: newPlant.id, status: "ok" };
};

export const deleteMockPlant = (id) => {
  mockPlants = mockPlants.filter((p) => p.id !== id);
  return { status: "deleted" };
};

export const MOCK_IDENTIFY = {
  name: "Фикус Бенджамина",
  latin: "Ficus benjamina",
  confidence: 92,
  description: "Популярное комнатное растение с глянцевыми листьями",
  care: {
    water: "раз в неделю",
    light: "рассеянный",
    temperature: "18–25°C",
  },
};

export const MOCK_DIAGNOSE = {
  problem: "Паутинный клещ",
  severity: "средняя",
  symptoms: [
    "Пожелтение листьев по краям",
    "Тонкая паутинка снизу",
    "Мелкие точки",
  ],
  treatment: [
    "Промыть листья мыльным раствором",
    "Убрать от других растений",
    "Обработать акарицидом через 3 дня",
  ],
  urgent: false,
};

export const MOCK_RECOMMEND = {
  recommendations: [
    {
      name: "Сансевиерия",
      why: "Выживает без полива месяцами, растёт в тени",
      difficulty: "лёгкое",
      safe_for_pets: true,
    },
    {
      name: "Замиокулькас",
      why: "Не боится тени и редкого полива, накапливает воду в корнях",
      difficulty: "лёгкое",
      safe_for_pets: false,
    },
  ],
};

export const MOCK_SCHEDULE = {
  plants: [
    {
      id: "plant_1",
      name: "Монстера",
      next_water: "2026-05-20",
      note: "Жарко (+28°C), поливать чаще",
    },
    {
      id: "plant_3",
      name: "Фикус",
      next_water: "2026-05-20",
      note: "Проверить на клеща после полива",
    },
  ],
};

export const MOCK_USER = {
  name: "Айдэна",
  email: "aidena@example.com",
  city: "Берлин",
};

export const MOCK_WEATHER = {
  city: "Ош",
  temp: 28,
  condition: "Ясно",
  icon: "ti-sun",
};
