import { configureStore, combineReducers } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import userReducer from "./userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage

// Persist Config (Only persist `isAuthenticated`)
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["isAuthenticated"], // ✅ Persist only this
};

// Combine Reducers
const rootReducer = combineReducers({
  modal: modalReducer, 
  user: persistReducer(persistConfig, userReducer), // Apply persistence to userReducer
});

// Configure Store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // ✅ Ignore these
      },
    }),
});


// Persistor
export const persistor = persistStore(store);
export default store;
