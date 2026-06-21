import { useEffect, useCallback, useRef } from 'react';
import { useTodos } from '../context/TodoContext';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const { todos } = useTodos();
  const notifiedIds = useRef(new Set());

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  const sendNotification = useCallback((title, body, icon = '/vite.svg') => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon });
    } else {
      toast(body, { icon: '🔔' });
    }
  }, []);

  useEffect(() => {
    if (!todos.length) return;

    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    todos.forEach((todo) => {
      if (todo.status === 'completed') return;

      // Due date alert
      if (todo.dueDate) {
        const dueDate = new Date(todo.dueDate);
        const dueSoonKey = `due-${todo.id}`;
        if (dueDate <= fiveMinutesFromNow && dueDate > now && !notifiedIds.current.has(dueSoonKey)) {
          notifiedIds.current.add(dueSoonKey);
          sendNotification('Task Due Soon', `"${todo.title}" is due in less than 5 minutes!`);
        }
        if (dueDate < now) {
          const overdueKey = `overdue-${todo.id}`;
          if (!notifiedIds.current.has(overdueKey)) {
            notifiedIds.current.add(overdueKey);
            toast.error(`Task overdue: "${todo.title}"`, { duration: 5000 });
          }
        }
      }

      // Reminder alert
      if (todo.reminderTime) {
        const reminderDate = new Date(todo.reminderTime);
        const reminderKey = `reminder-${todo.id}`;
        if (reminderDate <= now && !notifiedIds.current.has(reminderKey)) {
          const elapsed = now - reminderDate;
          if (elapsed < 60000) { // within last minute
            notifiedIds.current.add(reminderKey);
            sendNotification('Task Reminder', `Reminder: "${todo.title}"`);
          }
        }
      }
    });
  }, [todos, sendNotification]);

  return { requestPermission, sendNotification };
};
