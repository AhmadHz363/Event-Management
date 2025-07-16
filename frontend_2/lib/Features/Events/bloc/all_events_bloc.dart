import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:frontend_2/Services/event_services.dart';
import '../../../Models/EventModel.dart';
import 'all_events_event.dart';
import 'all_events_state.dart';


class AllEventsBloc extends Bloc<AllEventsEvent, AllEventsState> {
  AllEventsBloc() : super(AllEventsInitial()) {
    on<LoadAllEvents>(_onLoadAllEvents);
    on<RefreshAllEvents>(_onRefreshAllEvents);
  }

  Future<void> _onLoadAllEvents(
      LoadAllEvents event, Emitter<AllEventsState> emit) async {
    emit(AllEventsLoading());
    try {
      final events = await EventServices.getAllEvents();
      emit(AllEventsLoaded(events));
    } catch (e) {
      emit(AllEventsError(e.toString()));
    }
  }

  Future<void> _onRefreshAllEvents(
      RefreshAllEvents event, Emitter<AllEventsState> emit) async {
    // You can implement refresh similarly to load
    try {
      final events = await EventServices.getAllEvents();
      emit(AllEventsLoaded(events));
    } catch (e) {
      emit(AllEventsError(e.toString()));
    }
  }
}
