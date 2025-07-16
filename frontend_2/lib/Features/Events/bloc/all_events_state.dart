import '../../../Models/EventModel.dart';

abstract class AllEventsState {}

class AllEventsInitial extends AllEventsState {}

class AllEventsLoading extends AllEventsState {}

class AllEventsLoaded extends AllEventsState {
  final List<EventModel> events;
  AllEventsLoaded(this.events);
}

class AllEventsError extends AllEventsState {
  final String error;
  AllEventsError(this.error);
}
