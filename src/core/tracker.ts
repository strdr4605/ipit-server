import { interval } from 'rxjs';
import { filter } from 'rxjs/operators';
import { getManager } from 'typeorm';
import { UserEntity } from '../database';

const IntervalMinutes = 1;

interface Queue {
  userId: number;
  date: Date;
}

export class Tracker {
  private _queue: Queue[] = [];
  private _isWorking: boolean = false;

  public static Instance;

  constructor() {
    Tracker.Instance = this;

    interval(IntervalMinutes * 1000 * 60)
      .pipe(filter(() => this._queue.length > 0 && !this._isWorking))
      .subscribe(() => this.logUsersActivity());
  }

  public publish(userId: number): void {
    const queue: Queue = { userId: userId, date: new Date() };
    this._queue = this._queue.filter((el) => el.userId !== userId);
    this._queue.push(queue);
  }

  private logUsersActivity(): void {
    getManager().transaction(async (entityManager) => {
      this._isWorking = true;

      const users = await entityManager.findByIds(
        UserEntity,
        this._queue.map((el) => el.userId),
      );

      users.forEach((user) => {
        const queue = this._queue.find((el) => el.userId === user.id);
        user.lastActivity = queue.date;
      });

      await entityManager.save(UserEntity, users);

      this._queue = [];
      this._isWorking = false;
    });
  }
}
